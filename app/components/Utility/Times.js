let Times = (n,f) => {
  var x = [];
  while(n-- > 0)x.push(f(n + 1));
  return x;
}
export default Times;
