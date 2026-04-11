import "./index.css";
import {
  disableButton,
  enableValidation,
  resetValidation,
  validateConfig,
} from "../scripts/validation.js";
import Api from "../utils/Api.js";
import avatarImage from "../images/Avatar.png";
import logoImage from "../images/Logo.svg";
import pencilIcon from "../images/pencil.svg.svg";
import plusIcon from "../images/plus.svg";

const api = new Api({
  baseUrl: "https://around-api.en.tripleten-services.com/v1",
  headers: {
    authorization: "c56e30dc-2883-4270-a59e-b2f7bae969c6",
    "Content-Type": "application/json",
  },
});

const profileNameElement = document.querySelector(".profile__name");
const profileDescriptionElement = document.querySelector(
  ".profile__description"
);
const profileAvatarElement = document.querySelector(".profile__avatar");
const headerLogoElement = document.querySelector(".header__logo");
const profileEditIconElement = document.querySelector(".profile__edit-icon");
const profilePostButtonImageElement = document.querySelector(
  ".profile__post-button-image"
);

const profileEditButton = document.querySelector(".profile__edit-button");
const profileAvatarButton = document.querySelector(".profile__avatar-button");
const profilePostButton = document.querySelector(".profile__post-button");

const editProfileModal = document.querySelector("#edit-profile-modal");
const newPostModal = document.querySelector("#new-post-modal");
const editAvatarModal = document.querySelector("#edit-avatar-modal");
const deleteCardModal = document.querySelector("#delete-card-modal");
const previewModal = document.querySelector("#preview-modal");

const editFormElement = editProfileModal.querySelector(".modal__form");
const postFormElement = newPostModal.querySelector(".modal__form");
const avatarFormElement = editAvatarModal.querySelector(".modal__form");
const deleteFormElement = deleteCardModal.querySelector(".modal__form");

const nameInput = editProfileModal.querySelector("#modal__input-name");
const jobInput = editProfileModal.querySelector("#modal__input-description");
const linkInput = newPostModal.querySelector("#modal__input-link");
const captionInput = newPostModal.querySelector("#modal__input-caption");
const avatarInput = editAvatarModal.querySelector("#modal__input-avatar");

const editProfileSubmitButton =
  editProfileModal.querySelector(".modal__button-save");
const cardSubmitButton = newPostModal.querySelector(".modal__button-save");
const avatarSubmitButton = editAvatarModal.querySelector(".modal__button-save");
const deleteSubmitButton =
  deleteCardModal.querySelector(".modal__button-save");

const cardTemplate = document.querySelector("#cardTemplate");
const cardsList = document.querySelector(".cards__list");
const modalImage = previewModal.querySelector(".modal__image");
const modalCaption = previewModal.querySelector(".modal__caption");
const modals = document.querySelectorAll(".modal");

let currentUserId = "";
let selectedCard = null;
let selectedCardId = "";

headerLogoElement.src = logoImage;
profileAvatarElement.src = avatarImage;
profileEditIconElement.src = pencilIcon;
profilePostButtonImageElement.src = plusIcon;

function getCardOwnerId(cardData) {
  if (typeof cardData.owner === "string") {
    return cardData.owner;
  }

  return cardData.owner._id;
}

function setUserInfo({ name, about, avatar }) {
  profileNameElement.textContent = name;
  profileDescriptionElement.textContent = about;
  profileAvatarElement.src = avatar;
  profileAvatarElement.alt = name;
}

function setButtonText(button, isLoading, buttonText = "Save") {
  button.textContent = isLoading ? `${buttonText}...` : buttonText;
}

function handleEscape(evt) {
  if (evt.key === "Escape") {
    const activePopup = document.querySelector(".modal_opened");

    if (activePopup) {
      closeModal(activePopup);
    }
  }
}

function openModal(modal) {
  modal.classList.add("modal_opened");
  document.addEventListener("keyup", handleEscape);
}

function closeModal(modal) {
  modal.classList.remove("modal_opened");
  document.removeEventListener("keyup", handleEscape);
}

function renderCard(cardData, method = "prepend") {
  const cardElement = getCardElement(cardData);
  cardsList[method](cardElement);
}

function renderInitialCards(cards) {
  cards.forEach((card) => {
    renderCard(card, "append");
  });
}

function handleImageClick(data) {
  modalImage.src = data.link;
  modalImage.alt = data.name;
  modalCaption.textContent = data.name;
  openModal(previewModal);
}

function handleDeleteCard(cardElement, data) {
  selectedCard = cardElement;
  selectedCardId = data._id;
  openModal(deleteCardModal);
}

function handleLike(cardData, likeButton) {
  const isLiked = likeButton.classList.contains("card__like_liked");
  const request = isLiked ? api.removeLike(cardData._id) : api.addLike(cardData._id);

  request
    .then((updatedCard) => {
      likeButton.classList.toggle("card__like_liked", updatedCard.isLiked);
    })
    .catch((err) => {
      console.error(err);
    });
}

function getCardElement(data) {
  const cardElement = cardTemplate.content
    .querySelector(".card")
    .cloneNode(true);
  const cardText = cardElement.querySelector(".card__text");
  const cardImage = cardElement.querySelector(".card__image");
  const likeButton = cardElement.querySelector(".card__like");
  const deleteButton = cardElement.querySelector(".card__delete");

  cardText.textContent = data.name;
  cardImage.src = data.link;
  cardImage.alt = data.name;

  if (data.isLiked) {
    likeButton.classList.add("card__like_liked");
  }

  likeButton.addEventListener("click", () => {
    handleLike(data, likeButton);
  });

  if (getCardOwnerId(data) !== currentUserId) {
    deleteButton.remove();
  } else {
    deleteButton.addEventListener("click", () => {
      handleDeleteCard(cardElement, data);
    });
  }

  cardImage.addEventListener("click", () => {
    handleImageClick(data);
  });

  return cardElement;
}

function handleDeleteSubmit(evt) {
  evt.preventDefault();
  setButtonText(deleteSubmitButton, true, "Deleting");

  api
    .removeCard(selectedCardId)
    .then(() => {
      selectedCard.remove();
      selectedCard = null;
      selectedCardId = "";
      closeModal(deleteCardModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(deleteSubmitButton, false, "Delete");
    });
}

api
  .getAppInfo()
  .then(([userData, cards]) => {
    currentUserId = userData._id;
    setUserInfo(userData);
    renderInitialCards(cards);
  })
  .catch((err) => {
    console.error(err);
  });

profileEditButton.addEventListener("click", () => {
  nameInput.value = profileNameElement.textContent;
  jobInput.value = profileDescriptionElement.textContent;
  resetValidation(
    editFormElement,
    Array.from(editFormElement.querySelectorAll(validateConfig.inputSelector)),
    validateConfig
  );
  openModal(editProfileModal);
});

profilePostButton.addEventListener("click", () => {
  resetValidation(
    postFormElement,
    Array.from(postFormElement.querySelectorAll(validateConfig.inputSelector)),
    validateConfig
  );
  openModal(newPostModal);
});

profileAvatarButton.addEventListener("click", () => {
  avatarFormElement.reset();
  resetValidation(
    avatarFormElement,
    Array.from(avatarFormElement.querySelectorAll(validateConfig.inputSelector)),
    validateConfig
  );
  openModal(editAvatarModal);
});

editFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonText(editProfileSubmitButton, true);

  api
    .editUserInfo({
      name: nameInput.value,
      about: jobInput.value,
    })
    .then((userData) => {
      setUserInfo(userData);
      closeModal(editProfileModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(editProfileSubmitButton, false);
    });
});

postFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonText(cardSubmitButton, true);

  api
    .addCard({
      name: captionInput.value,
      link: linkInput.value,
    })
    .then((cardData) => {
      renderCard(cardData);
      postFormElement.reset();
      disableButton(cardSubmitButton, validateConfig);
      closeModal(newPostModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(cardSubmitButton, false);
    });
});

avatarFormElement.addEventListener("submit", (evt) => {
  evt.preventDefault();
  setButtonText(avatarSubmitButton, true);

  api
    .updateAvatar({
      avatar: avatarInput.value,
    })
    .then((userData) => {
      setUserInfo(userData);
      avatarFormElement.reset();
      disableButton(avatarSubmitButton, validateConfig);
      closeModal(editAvatarModal);
    })
    .catch((err) => {
      console.error(err);
    })
    .finally(() => {
      setButtonText(avatarSubmitButton, false);
    });
});

deleteFormElement.addEventListener("submit", handleDeleteSubmit);

modals.forEach((modal) => {
  modal.addEventListener("click", (evt) => {
    if (
      evt.target.classList.contains("modal") ||
      evt.target.classList.contains("modal__button-close")
    ) {
      closeModal(modal);
    }
  });
});

enableValidation(validateConfig);
