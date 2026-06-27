# Kotlin

> [github.com/brezinajn/openskill.kt](https://github.com/brezinajn/openskill.kt)

The Kotlin port exposes a small functional API that mirrors the JavaScript
library's shape — top-level `rate`, `rating`, and `ordinal` functions.

## Install

Add the dependency through Gradle (Kotlin DSL):

```kotlin
repositories {
    mavenCentral()
}

dependencies {
    implementation("io.github.brezinajn:openskill.kt:<latest>")
}
```

## Idiomatic usage

```kotlin
import io.github.brezinajn.openskill.Rating
import io.github.brezinajn.openskill.rate
import io.github.brezinajn.openskill.rating
import io.github.brezinajn.openskill.ordinal

fun main() {
    // 1. Create ratings
    val a1 = rating()
    val a2 = rating(mu = 32.444, sigma = 5.123)
    val b1 = rating(mu = 43.381, sigma = 2.421)
    val b2 = rating(mu = 25.188, sigma = 6.211)

    // 2. Team A beats Team B
    val (teamA, teamB) = rate(listOf(listOf(a1, a2), listOf(b1, b2)))
    val (a1New, a2New) = teamA
    val (b1New, b2New) = teamB

    // 3. Single-number ranking
    val board = listOf(a1New, a2New, b1New, b2New)
        .sortedByDescending { ordinal(it) }

    board.forEach { println("mu=${it.mu} sigma=${it.sigma}") }
}
```

## Free-for-all with explicit ranks

```kotlin
import io.github.brezinajn.openskill.rate
import io.github.brezinajn.openskill.rating

val players = List(4) { rating() }
val teams   = players.map { listOf(it) }

// P2 won, P4 second, P3 third, P1 last
val updated = rate(teams, rank = listOf(4, 1, 3, 2))
```

## Choosing a model

```kotlin
import io.github.brezinajn.openskill.models.bradleyTerryFull

val updated = rate(
    listOf(listOf(rating()), listOf(rating())),
    model = ::bradleyTerryFull,
)
```
