import json

input_path = 'src/data/screening_questions.json'
output_path = 'src/data/screening_questions.json'

with open(input_path, 'r', encoding='utf-8') as f:
    data = json.load(f)

cleaned_tests = []

for test in data['tests']:
    cleaned_questions = []
    
    for q in test['questions']:
        text = q.get('text', '').strip()
        options = q.get('options', [])
        
        # Aggressive cleaning: 
        # A question MUST have options to be playable.
        if len(options) == 0:
            continue
            
        # A question MUST have text.
        if not text:
            # Maybe check if options exist
            pass
            
        # Additional filter for headers treated as questions
        # Headers usually have no options, caught by check above.
        
        cleaned_questions.append(q)

    # Only add tests with questions
    test['questions'] = cleaned_questions
    if len(cleaned_questions) > 0:
        cleaned_tests.append(test)

final_data = {"tests": cleaned_tests}

with open(output_path, 'w', encoding='utf-8') as f:
    json.dump(final_data, f, indent=2, ensure_ascii=False)
    
print(f"Aggressive cleaning done. {len(cleaned_tests)} tests remain.")
print("Removed questions with 0 options.")
