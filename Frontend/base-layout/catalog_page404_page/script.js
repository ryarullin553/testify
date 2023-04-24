document.querySelectorAll('.select').forEach((select) => {
  const selectBtn = select.querySelector('.select__button')
  const selectList = select.querySelector('.select__list')
  const selectListItems = selectList.querySelectorAll('.select__list-item')

  // Клик по кнопке. Открыть/Закрыть select
  selectBtn.addEventListener('click', () => {
    selectList.classList.toggle('select__list--visible')
  })

  // Выбор элемента списка и запоминание выбранного значения.
  selectListItems.forEach((listItem) => {
    listItem.addEventListener('click', function (e) {
      e.stopPropagation()
      selectBtn.innerText = this.innerText
      selectBtn.focus()
      selectList.classList.remove('select__list--visible')
    })
  })

  // Обработка клика снаружи select`а
  document.addEventListener('click', (e) => {
    if (e.target !== selectBtn) {
      selectBtn.classList.remove('select__button--active')
      selectList.classList.remove('select__list--visible')
    }
  })

  // Закрытие select`а при нажатии на Tab или Escape
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Tab' || e.key === 'Escape') {
      selectBtn.classList.remove('select__button--active')
      selectList.classList.remove('select__list--visible')
    }
  })
})

document.querySelectorAll('.bookmark__button').forEach((item) => {
  item.addEventListener('click', function (e) {
    this.classList.toggle('active')
  })
})
