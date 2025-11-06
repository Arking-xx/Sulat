const limitCharacterLenght: number = 200;
const paragraphLimit: number = 100;

function limitChar(str: string, limit: number) {
  return str.length > limit ? `${str.slice(0, limit)}...` : str;
}

function capitilizeFirstCharacter(users: string | undefined) {
  if (!users) return '';
  return users.charAt(0).toUpperCase() + users.slice(1);
}

// for textarea
const resizeTextArea = (e: React.FormEvent<HTMLTextAreaElement>) => {
  e.currentTarget.style.height = 'auto';
  e.currentTarget.style.height = `${e.currentTarget.scrollHeight}px`;
};

const defaultImage =
  'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_1280.png';

const defaultAboutUser = `Lorem ipsum dolor sit amet consectetur adipisicing elit. Laboriosam hic iste distinctio,
            earum deserunt ipsa minima unde quos repellendus totam. Nemo, odio itaque blanditiis sed`;

export {
  limitChar,
  limitCharacterLenght,
  capitilizeFirstCharacter,
  paragraphLimit,
  resizeTextArea,
  defaultImage,
  defaultAboutUser,
};
