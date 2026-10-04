# Facts and limits — C curriculum 0.3

Source brief: references/c-podcast, section 0.3. Audience: first-time learners. Checked 2026-10-04.

- **Python:** high-level data structures, dynamic lists, libraries, extension code in C/C++: [Python tutorial](https://docs.python.org/3/tutorial/index.html), [Data structures](https://docs.python.org/3/tutorial/datastructures.html), [C extension introduction](https://docs.python.org/3/extending/extending.html). Python's runtime handles many memory details; this does not imply unlimited memory or that all implementations behave identically.
- **JavaScript:** browser interaction and updates: [MDN introduction](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Introduction). Runs outside browsers too: [Node.js introduction](https://nodejs.org/en/learn/getting-started/introduction-to-nodejs). Browser/server are example deployment contexts, not exclusive language categories.
- **C++:** derives historically from C, supports abstraction, classes and multiple programming styles, is a distinct language: [Bjarne Stroustrup FAQ](https://www.stroustrup.com/bs_faq.html). Do not claim all C is valid C++, or C++ requires classes, or C cannot organize large programs.
- **C in embedded systems:** [Zephyr C language support](https://docs.zephyrproject.org/latest/develop/languages/c/index.html). Hardware access in the scenario requires platform support; ISO C alone does not define sensors or browser access.
- **Linux:** [kernel programming language documentation](https://docs.kernel.org/process/programming-language.html) establishes C as the principal implementation language and documents Rust support. The narration says most of the kernel, not all Linux software, is written in C.
- **C memory bounds:** fixed-capacity regions and bounds responsibility are illustrated conceptually. No dynamic allocation or pointer syntax is taught. An invalid access is not presented as guaranteed deterministic behavior.
- **Overlapping language use:** [MicroPython](https://micropython.org/) supplies a concrete example of Python on microcontrollers. No claim that Python runs on every small device.

## Authored illustrative material

The temperature system is an explanatory scenario, not a recommended mandatory architecture. The roles C/device, Python/analysis, JavaScript/UI are one possible division. C++ can be used at the device/system layers too.

26, 27, 25 °C are invented example readings; mean = 26 °C. Appending 28 is a later list operation, not a claim the new mean stays 26. The ring-buffer example resets to an explicitly labeled full capacity of 100 and displays abbreviated slots (ellipsis). No memory-size or speed benchmark is asserted.

The episode ends with priorities and tradeoffs, not a language ranking. Compilation, CPU/RAM internals and C syntax are left for sections 0.4 onward.
