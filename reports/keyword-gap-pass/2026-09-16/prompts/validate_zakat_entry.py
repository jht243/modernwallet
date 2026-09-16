import re

text = open("src/data/calculators.ts").read()
start = text.index('id: "zakat",')
brace_start = text.rindex("{", 0, start)
depth = 0
i = brace_start
in_str = False
str_ch = None
esc = False
while i < len(text):
    c = text[i]
    if in_str:
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif c == str_ch:
            in_str = False
    else:
        if c == '"':
            in_str = True
            str_ch = c
        elif c == "{":
            depth += 1
        elif c == "}":
            depth -= 1
            if depth == 0:
                break
    i += 1
obj_text = text[brace_start:i + 1]
print("extracted entry length:", len(obj_text))
print("balanced OK (loop terminated by depth==0):", depth == 0)
# count question/answer pairs
qs = re.findall(r'question:\s*"', obj_text)
print("FAQ question count:", len(qs))
srcs = re.findall(r'label:\s*"', obj_text)
print("source label count:", len(srcs))
