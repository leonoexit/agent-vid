#include <stdio.h>
int main(void) {
    int x = 10;
    int *p = &x;
    printf("read: x=%d, *p=%d\n", x, *p);
    *p = 20;
    printf("write: x=%d, *p=%d, same_address=%d\n", x, *p, p == &x);
    *p = 30;
    printf("practice: x=%d, *p=%d, same_address=%d\n", x, *p, p == &x);
    return 0;
}
