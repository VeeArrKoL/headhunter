# headhunter
KoLmafia relay script for shrunken head, providing an interface to search for monsters which will have specified bonuses when reanimated using the [shrunken head](https://wiki.kingdomofloathing.com/Shrunken_head).

The data provided by headhunter is based on spading by MontyPythn (#256896).

## Installation
Install headhunter into KoLmafia by using this command in the gCLI:
```
git checkout VeeArrKoL/headhunter
```

## Usage
Open the relay script, select the path that you want to search and the bonuses you want your shrunken head zombie to have. If you want to permit additional bonuses, select the number of additional bonuses to permit from the "Allow Extras" drop-down.

## Questions
* Why does headhunter only list which bonuses the shrunken head zombie will have, and not the percentage of each bonus?
  * At the time of publication, the algorithm for determining the percentages for each bonus has not yet been spaded.
* Why does headhunter list monsters that aren't actually available in my path?
  * Generally speaking, KoLmafia doesn't have a good mechanism for determining exactly which monsters you could possibly have access to. Headhunter filters out boss monsters and monsters which cannot be copied (since the shrunken head cannot zombify these enemies), but otherwise doesn't attempt to do any further filtering.
* Why does the interface look so bad?
  * Because I'm not a front-end developer, and this is simple and gets the job done.
  