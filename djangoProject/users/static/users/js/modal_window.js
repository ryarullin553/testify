let controlledElems = {
  signInTab: document.getElementById('sign-in-tab'),
  signUpTab: document.getElementById('sign-up-tab'),
  resetTab: document.getElementById('reset-tab'),
  signInSwitch: document.getElementById('sign-in-switch'),
  signUpSwitch: document.getElementById('sign-up-switch'),
  resetSwitch: document.getElementById('reset-switch'),
  resetHeader: document.getElementById('reset-header')
};

let signFormWindow = document.getElementById('sign-form-window');

function handleSignInSwitch() {
  for (let elem in controlledElems) {
      controlledElems[elem].classList.remove('active');
  }
  controlledElems.signInTab.classList.add('active');
  controlledElems.signInSwitch.classList.add('active');
  
  signFormWindow.style.height = '500px';
}

function handleSignUpSwitch() {
  for (let elem in controlledElems) {
      controlledElems[elem].classList.remove('active');
  }
  controlledElems.signUpTab.classList.add('active');
  controlledElems.signUpSwitch.classList.add('active');

  signFormWindow.style.height = '450px';
}

function handleResetSwitch() {
  for (let elem in controlledElems) {
      controlledElems[elem].classList.remove('active');
  }
  controlledElems.resetTab.classList.add('active');
  controlledElems.resetHeader.classList.add('active');

}

controlledElems.signInSwitch.addEventListener('click', handleSignInSwitch);
controlledElems.signUpSwitch.addEventListener('click', handleSignUpSwitch);
controlledElems.resetSwitch.addEventListener('click', handleResetSwitch);