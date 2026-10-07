import json,sys
d=json.load(open(sys.argv[1]))
print("TITLE:",d['title']);print("H1:",d['h1']);print("META:",d['metaDescription']);print("BLURB:",d['cardBlurb']);print("\nINTRO:",d['introText'])
for s in d['sections']: print("\n## "+s['heading']+"\n"+s['body'])
print("\nTOOLS:",d['tools']);
for f in d['faqs']: print("\nQ:",f['question'],"\nA:",f['answer'])
print("\nSOURCES:",d['sources'])
