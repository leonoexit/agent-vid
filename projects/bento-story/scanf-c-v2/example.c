#include <stdio.h>

int main(void) {
    int age = 0;
    int n = scanf("%d", &age);
    if (n != 1) return 1;
    printf("age = %d\n", age);
    return 0;
}
