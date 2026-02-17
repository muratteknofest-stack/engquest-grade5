import json

with open('src/data/screening_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

cleaned_tests = []

for test in data['tests']:
    cleaned_questions = []
    seen_ids = set()
    
    # Filter questions
    for q in test['questions']:
        text = q['text'].strip()
        options = q['options']
        
        # Criteria for garbage:
        # 1. Text starts with "Sınıf" or contains "Sınıf İngilizce"
        # 2. Options are empty
        # 3. Text is empty
        is_garbage = False
        if "Sınıf" in text and len(options) == 0:
            is_garbage = True
        if not text and len(options) == 0:
            is_garbage = True
            
        if not is_garbage:
             cleaned_questions.append(q)

    # Re-sort or check for duplicates?
    # Actually, allow duplicates if they are valid parts (e.g. split questions), but here we assume valid parts were appended.
    # But wait, Q5 real + Q5 garbage.
    # If I remove garbage Q5, I have real Q5.
    
    test['questions'] = cleaned_questions
    if len(cleaned_questions) > 0:
        cleaned_tests.append(test)

final_data = {"tests": cleaned_tests}

with open('src/data/screening_questions.json', 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)
    
print(f"Cleaned JSON saved. {len(cleaned_tests)} tests.")
