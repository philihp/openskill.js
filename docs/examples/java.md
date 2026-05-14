# Java

> [github.com/pocketcombats/openskill-java](https://github.com/pocketcombats/openskill-java)

## Install

Add the dependency from Maven Central. Replace `<latest>` with the current
release.

**Gradle (Kotlin DSL):**

```kotlin
dependencies {
    implementation("com.pocketcombats:openskill:<latest>")
}
```

**Maven:**

```xml
<dependency>
    <groupId>com.pocketcombats</groupId>
    <artifactId>openskill</artifactId>
    <version><!-- latest --></version>
</dependency>
```

## Idiomatic usage

```java
import com.pocketcombats.openskill.PlackettLuce;
import com.pocketcombats.openskill.Rating;

import java.util.List;

public class Example {
    public static void main(String[] args) {
        PlackettLuce model = new PlackettLuce();

        // 1. Create ratings
        Rating a1 = model.rating();
        Rating a2 = model.rating(32.444, 5.123);
        Rating b1 = model.rating(43.381, 2.421);
        Rating b2 = model.rating(25.188, 6.211);

        // 2. Team A beats Team B
        List<List<Rating>> updated = model.rate(List.of(
            List.of(a1, a2),
            List.of(b1, b2)
        ));

        Rating a1New = updated.get(0).get(0);
        Rating b2New = updated.get(1).get(1);

        // 3. Sort by ordinal for a leaderboard
        List<Rating> all = List.of(
            updated.get(0).get(0),
            updated.get(0).get(1),
            updated.get(1).get(0),
            updated.get(1).get(1)
        );
        all.stream()
           .sorted((x, y) -> Double.compare(y.ordinal(), x.ordinal()))
           .forEach(r -> System.out.printf("mu=%.3f sigma=%.3f%n", r.mu(), r.sigma()));
    }
}
```

## Free-for-all with explicit ranks

```java
import com.pocketcombats.openskill.PlackettLuce;
import com.pocketcombats.openskill.Rating;
import com.pocketcombats.openskill.RateOptions;

import java.util.List;

PlackettLuce model = new PlackettLuce();

List<List<Rating>> teams = List.of(
    List.of(model.rating()),
    List.of(model.rating()),
    List.of(model.rating()),
    List.of(model.rating())
);

List<List<Rating>> updated = model.rate(
    teams,
    RateOptions.builder().ranks(List.of(4, 1, 3, 2)).build()
);
```
