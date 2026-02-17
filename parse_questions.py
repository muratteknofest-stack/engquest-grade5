import re
import json

def parse_pdf_content(file_path):
    with open(file_path, 'r', encoding='utf-8') as f:
        lines = f.readlines()

    # 1. Parse Answer Keys first (from end of file)
    answer_keys = {}
    key_start_index = 0
    
    # Look for "CEVAP ANAHTARI" from the end
    for i in range(len(lines) - 1, -1, -1):
        if "CEVAP ANAHTARI" in lines[i]:
            key_start_index = i
            break
            
    if key_start_index > 0:
        for i in range(key_start_index, len(lines)):
            line = lines[i].strip()
            # Match "Test 1 1. C 2. A ..."
            match = re.search(r'Test\s+(\d+)\s+(.*)', line)
            if match:
                test_num = int(match.group(1))
                answers_str = match.group(2)
                # Parse "1. C 2. A"
                # Remove extra spaces
                answers_parts = re.findall(r'(\d+)\.\s*([A-D])', answers_str)
                test_answers = {}
                for q_num, ans in answers_parts:
                    test_answers[int(q_num)] = ans
                answer_keys[test_num] = test_answers

    # 2. Parse Questions
    tests = []
    current_test = None
    current_question = None
    
    # Heuristic: Test numbers often appear alone or near "5. Sınıf"
    # We will try to rely on "Test numbers" usually 1-16
    # But extraction is noisy.
    
    # Alternative strategy: Detect Test headers roughly.
    # Lines like "5. Sınıf", "İngilizce", then a number "1" on next line.
    
    test_counter = 0
    
    for i, line in enumerate(lines):
        line = line.strip()
        if not line:
            continue
            
        # Detect Test Start
        # Usually "5. Sınıf" is near. And a standalone number.
        # Let's assume Tests are in order.
        # If we see "5. Sınıf" and then a number X > test_counter shortly after.
        
        # Simple heuristic: Identify questions "1. " and options "A) "
        # If we see "1. " and we already have a reasonably full test, maybe it's a new test?
        # But "1." can appear in text.
        
        # Let's use the Answer Key Test Count to guide us.
        # We expect 16 tests.
        
        # Pattern for Question: "^(\d+)\."
        q_match = re.match(r'^(\d+)\.\s+(.*)', line)
        
        # Pattern for Option: "^[A-D]\)" or "A)" inside line? 
        # Extraction often puts A) on new line.
        opt_match = re.match(r'^([A-D])\)\s*(.*)', line)

        # Detect new test by checking if Q number resets to 1
        if q_match:
            q_num = int(q_match.group(1))
            q_text = q_match.group(2)
            
            # Logic to switch test
            if q_num == 1:
                # If we were building a question, save it
                if current_question:
                    if current_test:
                        current_test['questions'].append(current_question)
                    current_question = None

                # If this is really a new test (Test 1 or previous test had > 5 questions)
                if current_test is None or (len(current_test['questions']) > 5):
                     # Start new test
                    test_counter += 1
                    current_test = {
                        "id": test_counter,
                        "title": f"Test {test_counter}",
                        "questions": []
                    }
                    tests.append(current_test)
            
            # Save previous question if exists
            elif current_question:
                if current_test:
                    current_test['questions'].append(current_question)
                current_question = None
            
            # Start new question
            current_question = {
                "id": q_num,
                "text": q_text,
                "options": [],
                "userAnswer": None
            }
            
        elif opt_match and current_question:
            # It's an option line: "A) Something"
            opt_letter = opt_match.group(1)
            opt_content = opt_line = line # Keep full line for now
            # Sometimes options are valid like "A) X  B) Y" on one line
            # Check for multiple options in one line
            
            # Regex to find all options in line: "A) ... B) ... "
            # This is tricky regex.
            # Let's just append the raw line to a temporary "raw_options" list and clean later?
            # Or simplified: Just add to options list.
            current_question['options'].append(line)
            
        elif current_question:
            # Continuation of question text or option?
            # If line doesn't start with number or A-D, append to last thing.
            if len(current_question['options']) > 0:
                current_question['options'][-1] += " " + line
            else:
                current_question['text'] += " " + line

    # Add last question
    if current_question and current_test:
        current_test['questions'].append(current_question)

    # 3. Clean up Options and Assign Correct Answers
    for test in tests:
        test_id = test['id']
        key_map = answer_keys.get(test_id, {})
        
        for q in test['questions']:
            q_id = q['id']
            
            # Assign correct answer
            correct_letter = key_map.get(q_id)
            
            # Clean options
            # Convert raw option lines into ["Option A", "Option B", ...]
            # Sometimes 4 options are on 4 lines, sometimes 2 lines (A B / C D).
            
            raw_opts = q['options']
            clean_opts = []
            
            # Consolidate raw text
            full_opt_text = " ".join(raw_opts)
            
            # Regex split by A), B), C), D)
            # Find indices
            letters = ['A', 'B', 'C', 'D']
            starts = []
            for letter in letters:
                pattern = f"{letter}\)"
                idx = full_opt_text.find(pattern)
                if idx != -1:
                    starts.append((idx, letter))
            
            starts.sort()
            
            final_options = []
            correct_index = -1
            
            if len(starts) == 4:
                for i in range(4):
                    start_idx = starts[i][0] + 2 # Skip "A)"
                    end_idx = starts[i+1][0] if i < 3 else len(full_opt_text)
                    opt_val = full_opt_text[start_idx:end_idx].strip()
                    final_options.append(opt_val)
                    
                    if letters[i] == correct_letter:
                        correct_index = i
            else:
                # Fallback if parsing failed
                final_options = raw_opts
            
            q['options'] = final_options
            q['correctAnswer'] = correct_index
            
    # Filter out empty tests or tests with few questions
    valid_tests = [t for t in tests if len(t['questions']) > 0]
    
    return valid_tests

data = parse_pdf_content('pdf_content.txt')
print(json.dumps(data, indent=2, ensure_ascii=False))

# Save to file
with open('src/data/screening_questions.json', 'w', encoding='utf-8') as f:
    json.dump({"tests": data}, f, indent=2, ensure_ascii=False)
