# headhunter
KoLmafia relay script for shrunken head, providing an interface to search for monsters which will have specified bonuses when reanimated using the [shrunken head](https://wiki.kingdomofloathing.com/Shrunken_head).

The data provided by headhunter is based on spading by MontyPythn (#256896) and Jeparo (#2246666).

## Installation
headhunter requires KoLmafia r29273 or newer. Install headhunter into KoLmafia by using this command in the gCLI:
```
git checkout VeeArrKoL/headhunter
```

## Usage
Open the relay script, select the path that you want to search and the bonuses you want your shrunken head zombie to have. If you want to permit additional bonuses, select the number of additional bonuses to permit from the "Allow Extras" drop-down. Results will be sorted by the bonus selected in the "Sort By" field (in decreasing order), followed by the number of additional bonuses (in increasing order), followed by alphabetically.

## Questions
* Why does headhunter list monsters that aren't actually available in my path?
  * Generally speaking, KoLmafia doesn't have a good mechanism for determining exactly which monsters you could possibly have access to. Headhunter filters out boss monsters and monsters which cannot be copied (since the shrunken head cannot zombify these enemies), but otherwise doesn't attempt to do any further filtering.
* Why does the interface look so bad?
  * Because I'm not a front-end developer, and this is simple and gets the job done.
  