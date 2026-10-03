#include <stdio.h>

int main(void) {
    int x = 10;
    int *p = &x;
    *p = 20;
    printf("x = %d, *p = %d\n", x, *p);
    return 0;
}
