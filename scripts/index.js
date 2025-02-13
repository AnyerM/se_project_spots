const initialCards = [
  {
    name: "Val Thorens",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/1-photo-by-moritz-feldmann-from-pexels.jpg",
  },
  {
    name: "Restaurant terrace",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/2-photo-by-ceiline-from-pexels.jpg",
  },
  {
    name: "An outdoor cafe",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/3-photo-by-tubanur-dogan-from-pexels.jpg",
  },
  {
    name: "A very long bridge, over the forest and through the trees",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/4-photo-by-maurice-laschet-from-pexels.jpg",
  },
  {
    name: "Tunnel with morning light",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/5-photo-by-van-anh-nguyen-from-pexels.jpg",
  },
  {
    name: "Mountain house",
    link: "https://practicum-content.s3.us-west-1.amazonaws.com/software-engineer/spots/6-photo-by-moritz-feldmann-from-pexels.jpg",
  },
];

const profileEditButton = document.querySelector(".profile__edit-button");
const editProfileModal = document.querySelector("#edit-profile-modal");
const nameInput = editProfileModal.querySelector("#modal__input-name");
const jobInput = editProfileModal.querySelector("#modal__input-description");
const editFormElement = editProfileModal.querySelector(".modal__form");
const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);

const closeProfileModal = editProfileModal.querySelector(
  ".modal__button-close"
);
const textContent = document.getElementById("textContent");
const profileJobElement = document.querySelector(".profile__description");

const profilePostButton = document.querySelector(".profile__post-button");
const newPostModal = document.querySelector("#new-post-modal");
const linkInput = newPostModal.querySelector("#modal__input-link");
const captionInput = newPostModal.querySelector("#modal__input-caption");
const postFormElement = newPostModal.querySelector(".modal__form");
const cardImage = document.querySelector(".card__image");
const cardText = document.querySelector(".card__text");
const closePostModal = newPostModal.querySelector(".modal__button-close");

function openModal(modal) {
  modal.classList.add("modal_opened");
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
}

profileEditButton.addEventListener("click", () => {
  openModal(editProfileModal);
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileJobElement.textContent;
});

closeProfileModal.addEventListener("click", () => {
  closeModal(editProfileModal);
});

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  profileNameElement.textContent = nameInput.value;
  profileDescriptionElement.textContent = jobInput.value;
  closeModal(editProfileModal);
});

profilePostButton.addEventListener("click", () => {
  openModal(newPostModal);
});

closePostModal.addEventListener("click", () => {
  closeModal(newPostModal);
});

postFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  const inputValues = { name: captionInput.value, link: linkInput.value };
  const cardElement = getCardElement(inputValues);
  cardsList.prepend(cardElement);

  postFormElement.reset();

  closeModal(newPostModal);
});

const cardTemplate = document.querySelector("#cardTemplate");
const cardsList = document.querySelector(".cards__list");
const previewModal = document.querySelector("#preview-modal");
const modalImage = previewModal.querySelector(".modal__image");
const modalCaption = previewModal.querySelector(".modal__caption");
const closePreviewModal = previewModal.querySelector(
  ".modal__button-close-preview"
);

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);

  const cardText = cardElement.querySelector(".card__text");
  const cardImage = cardElement.querySelector(".card__image");
  cardText.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  const likeButton = cardElement.querySelector(".card__like");

  likeButton.addEventListener("click", () => {
    likeButton.classList.toggle("card__like_liked");
  });

  const deleteButton = cardElement.querySelector(".card__delete");
  deleteButton.addEventListener("click", () => {
    cardElement.remove();
  });

  cardImage.addEventListener("click", () => {
    openModal(previewModal);
    modalImage.src = data.link;
    modalImage.alt = data.name;
    modalCaption.textContent = data.name;
  });

  return cardElement;
}

closePreviewModal.addEventListener("click", () => {
  closeModal(previewModal);
});

initialCards.forEach((item) => {
  const cardElement = getCardElement(item);
  cardsList.prepend(cardElement);
});
