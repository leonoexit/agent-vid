"""Dependency-free pause-assisted estimates; monotonicity is guaranteed, alignment is not."""
import math
import re


def estimate_words(text, span, gaps):
    chunks = [c.strip() for c in re.split(r'(?<=[.,;:!?])\s+', text) if c.strip()]
    if not chunks:
        return []
    lead, tail = span
    if not (math.isfinite(lead) and math.isfinite(tail) and 0 <= lead < tail):
        raise ValueError('Invalid speech span')
    weights = [sum(len(w) + 2 for w in c.split()) for c in chunks]
    total, acc = sum(weights), 0
    guesses = []
    for weight in weights[:-1]:
        acc += weight
        guesses.append(lead + (tail-lead)*acc/total)
    # A pause must fit the boundary's own non-overlapping window. Nearest-unused
    # snapping alone can choose a later pause and then jump backwards next time.
    edges = []
    for i, guess in enumerate(guesses):
        lo = ((guesses[i-1] if i else lead) + guess)/2
        hi = (guess + (guesses[i+1] if i+1 < len(guesses) else tail))/2
        candidates = [(a,b) for a,b in gaps if lo < a <= b < hi]
        best = min(candidates, key=lambda g: abs((g[0]+g[1])/2-guess), default=(guess,guess))
        edges.append(best if abs(sum(best)/2-guess) < 1.2 else (guess,guess))
    spans = list(zip([lead]+[b for a,b in edges], [a for a,b in edges]+[tail]))
    words = []
    for chunk, (a,b), weight in zip(chunks,spans,weights):
        t = a
        for w in chunk.split():
            d = (b-a)*(len(w)+2)/weight
            words.append({'w':w,'start':round(t,6),'end':round(t+d*.92,6)})
            t += d
    return words


def validate_words(words, duration):
    previous = 0
    for i, w in enumerate(words):
        a,b = w.get('start'),w.get('end')
        if not all(isinstance(x,(int,float)) and not isinstance(x,bool) and math.isfinite(x) for x in (a,b)):
            raise ValueError(f'word {i}: non-numeric timing')
        if not previous <= a < b <= duration + .02:
            raise ValueError(f'word {i}: reversed, overlapping or out-of-clip timing ({a}, {b})')
        previous = b
