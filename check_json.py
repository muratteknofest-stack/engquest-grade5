import json

with open('src/data/screening_questions.json', 'r', encoding='utf-8') as f:
    data = json.load(f)

tests = data['tests']
total_q = 0
valid_a = 0

for t in tests:
    print(f"Test {t['id']}: {len(t['questions'])} questions")
    for q in t['questions']:
        total_q += 1
        if q['correctAnswer'] != -1:
            valid_a += 1
        else:
            # Print first few failures
            if total_q < 5:
                print(f"  Failed Q{q['id']}: Key might be missing or content mismatch.")

print(f"Total Questions: {total_q}")
print(f"Valid Answers: {valid_a}")
