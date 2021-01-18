const randomString = () => {
  const random = Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 10);

  return random.substring(0, 40);
}
export default randomString
