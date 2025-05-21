// Utilidad para reordenar un array
function arrayMove(array, from, to) {
  const newArr = array.slice();
  const [moved] = newArr.splice(from, 1);
  newArr.splice(to, 0, moved);
  return newArr;
}

export { arrayMove };
