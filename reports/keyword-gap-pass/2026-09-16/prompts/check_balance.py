text = open("src/data/guides.ts").read()
pairs = {')': '(', ']': '[', '}': '{'}
opens = set(pairs.values())
closes = set(pairs.keys())
stack = []
in_str = False
str_ch = None
i = 0
n = len(text)
line = 1
esc = False
while i < n:
    c = text[i]
    if c == "\n":
        line += 1
    if in_str:
        if esc:
            esc = False
        elif c == "\\":
            esc = True
        elif c == str_ch:
            in_str = False
    else:
        if c in ('"', "'", "`"):
            in_str = True
            str_ch = c
        elif c == "/" and i + 1 < n and text[i + 1] == "/":
            while i < n and text[i] != "\n":
                i += 1
            continue
        elif c in opens:
            stack.append((c, line))
        elif c in closes:
            if not stack:
                print("UNMATCHED CLOSE", c, "at line", line)
                break
            top = stack.pop()
            if top[0] != pairs[c]:
                print("MISMATCH", top, c, "at line", line)
                break
    i += 1
print("stack remaining (should be empty):", stack[:5], "len", len(stack))
print("in_str at EOF:", in_str)
