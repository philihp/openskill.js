# Google Apps Script

> [github.com/haya14busa/gas-openskill](https://github.com/haya14busa/gas-openskill)

`gas-openskill` is a Google Apps Script library wrapping the openskill
algorithm. It's the easiest way to keep skill ratings inside a Google Sheet
or Google Workspace add-on.

There's also a [companion Google Sheets template](https://docs.google.com/spreadsheets/d/12TA1ZG_qpBi4kDTclaOGB4sd5uJK8w-0My6puMd2-CY/edit?usp=sharing)
if you want a no-code starting point.

## Install

In the Apps Script editor:

1. Open **Project Settings** and copy the script ID from the
   [`gas-openskill` repo](https://github.com/haya14busa/gas-openskill).
2. Click **Libraries → +**, paste the script ID, pick the latest version, and
   set the identifier to `Openskill`.

## Idiomatic usage

```js
function rateMatch() {
  // 1. Create ratings — Apps Script tip: persist mu/sigma in the sheet,
  //    not the Rating object, since runs don't share state.
  const a1 = Openskill.rating()                                     // mu=25, sigma≈8.333
  const a2 = Openskill.rating({ mu: 32.444, sigma: 5.123 })
  const b1 = Openskill.rating({ mu: 43.381, sigma: 2.421 })
  const b2 = Openskill.rating({ mu: 25.188, sigma: 6.211 })

  // 2. Team A beats Team B
  const [[a1n, a2n], [b1n, b2n]] = Openskill.rate([
    [a1, a2],
    [b1, b2],
  ])

  // 3. Write the new ratings back into the sheet
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName('Players')
  sheet.getRange('B2:C2').setValues([[a1n.mu, a1n.sigma]])
  sheet.getRange('B3:C3').setValues([[a2n.mu, a2n.sigma]])
  sheet.getRange('B4:C4').setValues([[b1n.mu, b1n.sigma]])
  sheet.getRange('B5:C5').setValues([[b2n.mu, b2n.sigma]])
}
```

## Custom function for a Sheet

Expose `ordinal` as a custom spreadsheet function so cells can show a single
sortable number.

```js
/**
 * @param {number} mu
 * @param {number} sigma
 * @return number  Skill ordinal (mu - 3*sigma).
 * @customfunction
 */
function ORDINAL(mu, sigma) {
  return Openskill.ordinal({ mu: mu, sigma: sigma })
}
```

Then in any cell: `=ORDINAL(B2, C2)`.
