# C facts used in this demonstration

- A pointer stores an address that can be used to access the pointed-to object. [GNU C: Pointers](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointers.html).
- `&x` obtains the address of x. “Ô A” is only a symbolic location used in the first analogy, not a real address or literal C value. [GNU C: Address of Data](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Address-of-Data.html).
- `int *p = &x;` declares/initializes a pointer to int. `*p` in the later expression accesses x, and `*p = 20;` changes x while p continues to point to x. The star in a declaration and the dereference operator have related but distinct roles. [GNU C: Pointer Dereference](https://www.gnu.org/software/c-intro-and-ref/manual/html_node/Pointer-Dereference.html).
- The source object remains alive and p has a valid address before every access in this example. This explanation does not attempt pointer arithmetic, allocation, null pointers or pointer-to-pointer syntax.

Verified example.c with `cc -Wall -Wextra -Werror`: reads 10, writes 20, then writes 30. Both writes preserve `p == &x`.
The moving address/data tokens are explanatory metaphors, not a depiction of hardware timing or a copied memory object.
