function limitChar(str: string, limit: number) {
  return str.length > limit ? `${str.slice(0, limit)}...` : str;
}

function capitilizeFirstCharacter(users: string | undefined) {
  if (!users) return '';
  return users.charAt(0).toUpperCase() + users.slice(1);
}

const limitCharacterLenght: number = 200;
const paragraphLimit: number = 100;

export { limitChar, limitCharacterLenght, capitilizeFirstCharacter, paragraphLimit };
