import re
import json

def parse_pdf_content(file_path):
    print("Starting parsing...")
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Parse Answer Keys first (from end of file)
    answer_keys = {}
    key_start_index = 0
    
    # Look for "CEVAP ANAHTARI" from the end
    for i in range(len(lines) - 1, -1, -1):
        if "CEVAP ANAHTARI" in lines[i]:
            key_start_index = i
            print(f"Found Key Start at line {i}")
            break
            
    if key_start_index > 0:
        for i in range(key_start_index, len(lines)):
            line = lines[i].strip()
            # Match "Test 1 1. C 2. A ..."
            # Regex: Test <number> <content>
            match = re.search(r'Test\s+(\d+)\s+(.*)', line)
            if match:
                test_num = int(match.group(1))
                answers_str = match.group(2)
                # Parse "1. C 2. A" or "1.C 2.A"
                # Remove extra spaces
                answers_parts = re.findall(r'(\d+)\.\s*([A-D])', answers_str)
                test_answers = {}
                for q_num, ans in answers_parts:
                    test_answers[int(q_num)] = ans
                answer_keys[test_num] = test_answers
                print(f"Parsed Key for Test {test_num}: {len(test_answers)} answers")
            else:
                 # Debug: print line if it looks like it might have keys but failed regex
                 if "Test" in line:
                     print(f"Ignored potential key line: {line}")

    # 2. Parse Questions
    tests = []
    current_test = None
    current_question = None
    
    test_counter = 0
    
    # Text cleaning helper
    def clean_text(text):
        if not text: return ""
        garbage = [
            "MEB  2018 - 2019",
            "Ölçme, Değerlendirme ve Sınav Hizmetleri Genel Müdürlüğü",
            "http://odsgm.meb.gov.tr/kurslar/",
            "Cevap anahtarına ulaşmak için karekodu okutunuz.",
            "5. Sınıf",
            "İngilizce"
        ]
        text = text.strip()
        for g in garbage:
            text = text.replace(g, "")
        
        # Remove standalone numbers that are page numbers
        if re.match(r'^\d+$', text):
            return ""
            
        return text.strip()

    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        if "CEVAP ANAHTARI" in line:
            break

        # Check for Test Start roughly
        # Heuristic: If we see a Question 1, and we have enough questions in previous test
        
        # Pattern for Question: "^(\d+)\." - Allow empty text after dot
        q_match = re.match(r'^(\d+)\.(\s*(.*))?$', line)
        
        # Pattern for Option: "^[A-D]\)" or "A)" inside line? 
        opt_match = re.match(r'^([A-D])\)\s*(.*)', line)
        
        # Special case: Option A) might be stuck to text? No, usually distinct line.

        if q_match:
            q_num = int(q_match.group(1))
            raw_text = q_match.group(3) if q_match.group(3) else ""
            q_text = clean_text(raw_text)
            
            # Logic to switch test
            if q_num == 1:
                # If we were building a question, save it
                if current_question:
                    if current_test:
                        current_test['questions'].append(current_question)
                    current_question = None

                # Start new test if needed
                if current_test is None or (len(current_test['questions']) > 2): # Heuristic > 2
                    test_counter += 1
                    current_test = {
                        "id": test_counter,
                        "title": f"Test {test_counter}",
                        "questions": []
                    }
                    tests.append(current_test)
                    print(f"Starting Test {test_counter}...")
            
            # Save previous question
            elif current_question:
                if current_test:
                    current_test['questions'].append(current_question)
                current_question = None
            
            # Start new question
            current_question = {
                "id": q_num,
                "text": q_text,
                "options": [],
                "userAnswer": None,
                "correctAnswer": -1 # Initialize
            }
            
        elif opt_match and current_question:
            # Option line
            opt_line = clean_text(line)
            if opt_line:
                current_question['options'].append(opt_line)
            
        elif current_question:
            # Continuation
            cleaned = clean_text(line)
            if cleaned:
                if len(current_question['options']) > 0:
                    current_question['options'][-1] += " " + cleaned
                else:
                    current_question['text'] += " " + cleaned

    # Add last question
    if current_question and current_test:
        current_test['questions'].append(current_question)

    # 3. Clean up Options and Assign Correct Answers
    letters = ['A', 'B', 'C', 'D']
    
    for test in tests:
        test_id = test['id']
        key_map = answer_keys.get(test_id, {})
        print(f"Processing Test {test_id}, Key Map Size: {len(key_map)}")
        
        for q in test['questions']:
            q_id = q['id']
            # Correct answer from key
            if q_id in key_map:
                correct_letter = key_map[q_id]
            else:
                correct_letter = None
                
            # Parse options
            raw_opts = q['options']
            full_opt_text = " ".join(raw_opts)
            
            starts = []
            for letter in letters:
                pattern = f"{letter}\)"
                idx = full_opt_text.find(pattern)
                if idx != -1:
                    starts.append((idx, letter))
            
            starts.sort()
            
            final_options = []
            correct_index = -1
            
            if len(starts) >= 2:
                for i in range(len(starts)):
                    start_idx = starts[i][0] + 2
                    end_idx = starts[i+1][0] if i < len(starts)-1 else len(full_opt_text)
                    opt_val = full_opt_text[start_idx:end_idx].strip()
                    final_options.append(opt_val)
                    
                    if correct_letter and starts[i][1] == correct_letter:
                        correct_index = i
            else:
                 final_options = raw_opts
                 # Fallback: if we didn't parse clean options, maybe we can't determine correct index easily
                 # But if we have 4 items in raw_opts?
                 if len(final_options) == 4 and correct_letter:
                     correct_index = letters.index(correct_letter)
            
            q['options'] = final_options
            if correct_index != -1:
                q['correctAnswer'] = correct_index
            else:
                # Last resort debug
                if correct_letter:
                     # Maybe only A, B, C found but D missing?
                     pass

    valid_tests = [t for t in tests if len(t['questions']) > 0]
    
    # Save to file
    with open('src/data/screening_questions.json', 'w', encoding='utf-8') as f:
        json.dump({"tests": valid_tests}, f, indent=2, ensure_ascii=False)
        
    print(f"Saved {len(valid_tests)} tests to src/data/screening_questions.json")

if __name__ == "__main__":
    parse_pdf_content('pdf_content.txt')
