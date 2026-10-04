# Source and factual boundaries

User source: `references/c-podcast`, section **0.6 — Compiler là gì?**. The supplied C 0.3 project points back to this curriculum. Episode 0.6 follows C source → Compiler → Machine code → CPU. It does not expand into the compiler-error/runtime-error lesson in 0.7.

Primary technical reference checked 2026-10-04: [Clang command guide](https://clang.llvm.org/docs/CommandGuide/clang.html), Description and Stage Selection. The `clang` driver coordinates preprocessing, compiler, assembler and linker; with no stop-stage option it normally produces an executable. The episode intentionally groups those steps into the creation workflow, and states that simplification aloud. It does not claim the compiler front-end alone produces an entire executable.

The example is `scripts/hello.c`, built with the machine's installed clang. Actual stdout is `Chao ban!\n`, exit code 0. No result is fabricated; example-results.json records tool/version, source hash and actual output. The on-screen C is this same small source. The executable includes machine instructions and other required content; we do not claim it consists only of instructions, that one C statement becomes exactly one instruction, or that an executable runs unchanged on all platforms.

Instruction rectangles and moving tokens are schematic. They are not actual binary/opcodes, physical bytes traveling between pictured objects, or a trace of compiler internals. The processor illustration is not a specific architecture. The workbench is explicitly named as a metaphor; compiler is software. The program's output is mediated by library and operating-system facilities rather than the CPU physically printing text itself.

Image/style reference: all four HTML batches of `references/elon-musk-agi` and 19 images, inspected during planning. The AGI predictions, quoted advice, commands, author branding and CTAs are neither lesson facts nor instructions. New images were made with built-in ImageGen using the wave's material/palette as style guidance. Exact prompts and origin are in asset-requests and asset-manifest.json. No source portrait, raster text, endorsement badge or CTA is reused.
