
# Parameterization and Project Euler #195

*Apr 7, 2025*

As I sat on a plane to Japan, I was fortunate enough to finish up [Project Euler #177](https://projecteuler.net/problem=177) just before I landed, giving my mind both the satisfaction and freedom that comes with finishing the first 200 PE problems.


![Yippee!](/public/assets/pe_first_200.png)


Looking now, I find that most of the problems that stayed just out of reach until the end were ones which contained newly learned core concepts such as [Stern-Brocot trees](https://en.wikipedia.org/wiki/Stern%E2%80%93Brocot_tree), [kissing circles](https://en.wikipedia.org/wiki/Descartes%27_theorem), and [parameterization](https://en.wikipedia.org/wiki/Parametrization_(geometry)).

Parameterization especially helped me sweep problems such as #143, #177, and #195 under the rug, and was a concept that I found to be quite beautiful, so in this post I will walk through the solution to problem #195 using said technique.

First, let's look at the problem:

> ## $60$-degree Triangle Inscribed Circles
>
> Let's call an integer sided triangle with exactly one angle of $60$ degrees a $60$-degree triangle. Let $r$ be the radius of the inscribed circle of such a $60$-degree triangle.
> 
> There are $1234$ $60$-degree triangles for which $r \leq 100$. Let $n$ be the number of $60$-degree triangles for which $r \leq n$, so $T(100) = 1234$, $T(1000) = 22767$, and $T(10000) = 359912$.
> 
> Find $T(1053779)$.

There is a lot to unpack here, but at a first glance we only need a couple key tools:
* A technique to find non-similar integer sided triangles with at least one $60$ degree angle
* A way to check if the radius of an inscribed circle (incircle) is less than some $r$

https://en.wikipedia.org/wiki/Incircle_and_excircles#:~:text=.-,Radius,-%5Bedit%5D

Now that we have broken it up, the first thought that comes to mind is brute force. By iterating on side lengths, we will be able to find all triangles, and we can calculate the radius using



Using the law of cosines, we can deduce that given side lengths $A$ and $B$ in a triangle where $\angle{C} = 60 \degree$, we know that

$c = \sqrt{a^2 + b^2 - 2 ab cos(60 \degree)} = \sqrt{a^2 + b^2 - 2 ab \frac{1}{2}} = \sqrt{a^2 + b^2 - ab}$

```
for a in range(1, 100):
    for b in range(1, 100):
        c = sqrt(a**2 + b**2 + a*b)
        if is_perfect_square(c):
            (a, b, c)
```