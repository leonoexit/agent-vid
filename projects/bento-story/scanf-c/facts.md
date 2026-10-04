# Factual basis

Primary reference: [The Open Group: fscanf / scanf](https://pubs.opengroup.org/onlinepubs/9699919799/functions/fscanf.html).
Checked for this video: scanf reads stdin; %d converts a decimal integer and requires int* without a length modifier;
&age supplies that pointer. The function returns the count of successfully assigned input items. Here one successful
conversion returns 1; a matching failure can return 0 and an input failure before conversion can return EOF.
The guard n != 1 handles both failure categories without pretending every failure returns 0.

The visual traces valid representable input 18, with age initialized to 0. Terminal Enter is the usual interactive
submission step; it is not a C requirement for every input stream. The left card is submitted input history, not a
claim that scanf consumes the entire line or removes its newline. No claim of general validation of arbitrary input
or out-of-range integers is made. &age is C notation, not a made-up numeric address. Optional invalid-input check
is exercised in the C fixture, not a second animated example. No historical source-carousel claims are reused.
