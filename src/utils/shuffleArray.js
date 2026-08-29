// Randomly reorders the items in an array using the Fisher-Yates shuffle.
//
// Why not `array.sort(() => Math.random() - 0.5)`? That common shortcut is
// actually biased -- some orderings end up more likely than others because
// of how sort's comparison function gets called. Fisher-Yates guarantees
// every possible ordering is equally likely.
//
// How it works: walk the array backwards from the last item. For each
// position, pick a random earlier-or-equal position and swap the two items.
// By the time we reach the front of the array, everything has been shuffled.
export function shuffleArray(originalArray) {
  // Copy the array first -- this function should never mutate its input,
  // since callers (like our quiz options) may still hold a reference to it.
  const shuffledArray = [...originalArray]

  for (let currentIndex = shuffledArray.length - 1; currentIndex > 0; currentIndex--) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1))
    // Swap the current item with the randomly chosen one.
    ;[shuffledArray[currentIndex], shuffledArray[randomIndex]] = [
      shuffledArray[randomIndex],
      shuffledArray[currentIndex],
    ]
  }

  return shuffledArray
}
