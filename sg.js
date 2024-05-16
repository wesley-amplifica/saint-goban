$ = jQuery;

// Form
if (typeof formUrl === 'undefined') {
  var formUrl = formUrlDefault;
}
if (typeof formId === 'undefined') {
  var formId = formIdDefault;
}

// Loading
const Loading = {
  on() { document.body.classList.add('loading'); },
  off() { document.body.classList.remove('loading'); }
};

// Converte links do Google
const GoogleDriveLink2Download = {
  convert: (url) => {
    let id = '';
    let result = null;
    let regExp = /^https:\/\/drive\.google\.com\/file\/d\/(.+)\/view$/;
    result = regExp.exec(url);
    if (result !== null) {
      id = result[1];
    }
    if (id === '') {
      console.log('O URL fornecido não é um link válido do Google Drive.');
      alert('O URL fornecido não é um link válido do Google Drive.');
      return '';
    } else {
      return 'https://drive.google.com/uc?export=download&id=' + id;
    }
  }
};

const openNewTab = function (url) {
  let element = document.createElement('a');
  element.setAttribute('href', url);
  element.setAttribute('target', '_blank');
  element.style.display = 'none';
  document.body.appendChild(element);

  // Variável para verificar se a guia foi aberta com sucesso
  let tabOpened = false;

  // Adicionar evento de escuta para verificar se a guia foi aberta
  const tabListener = () => {
    tabOpened = true;
    cleanup();
  };

  // Adicionar evento de escuta para verificar se houve algum erro ao abrir a guia
  const errorListener = () => {
    tabOpened = false;
    cleanup();
  };

  // Adicionar eventos
  element.addEventListener('click', tabListener);
  element.addEventListener('error', errorListener);

  // Simular o clique para abrir a guia
  element.click();

  // Função para limpar eventos e remover elemento do DOM
  const cleanup = () => {
    document.body.removeChild(element);
    element.removeEventListener('click', tabListener);
    element.removeEventListener('error', errorListener);

    // Verificar se a guia foi aberta com sucesso ou redirecionar se houve erro
    if (tabOpened) {
      console.log('A guia foi aberta com sucesso!');
      // Coloque aqui o código que deseja executar após a guia ser aberta
    } else {
      console.error('Erro ao abrir a guia:', url);
      window.location.href = url;
    }
  };
};

document.addEventListener('DOMContentLoaded', function () {
  // Função para alternar os radios dentro de cada instância
  function radioSlideshowAutoplay(slideshow) {
    var slideshowRadios = slideshow.querySelectorAll('input[type="radio"]');

    if (slideshowRadios.length > 0) {
      var currentCheckedIndex = -1;

      for (var i = 0; i < slideshowRadios.length; i++) {
        if (slideshowRadios[i].checked) {
          currentCheckedIndex = i;
          break;
        }
      }

      if (currentCheckedIndex !== -1) {
        slideshowRadios[currentCheckedIndex].checked = false;
        slideshowRadios[(currentCheckedIndex + 1) % slideshowRadios.length].checked = true;
      } else {
        slideshowRadios[0].checked = true;
      }
    }
  }

  // Inicializa o intervalo para cada instância
  var slideshowInstances = document.querySelectorAll('.radio-slideshow');
  slideshowInstances.forEach(function (slideshow) {
    var intervalId = setInterval(function () {
      radioSlideshowAutoplay(slideshow);
    }, 5000);

    // Função para reiniciar o intervalo para cada instância
    function restartInterval() {
      clearInterval(intervalId);
      intervalId = setInterval(function () {
        radioSlideshowAutoplay(slideshow);
      }, 5000);
    }

    // Adiciona o evento de clique para reiniciar o intervalo para cada instância
    var slideshowRadios = slideshow.querySelectorAll('input[type="radio"]');
    slideshowRadios.forEach(function (radio) {
      radio.addEventListener('click', restartInterval);
    });
  });


  $('#catalogo #form-wrapper').load(formUrl + ' ' + formId, function () {
    $('#catalogo #edit-captcha').remove();
    $('#catalogo .form-actions').removeClass('form-actions');
    masks();

    $(formId).on('submit', function (event) {
      event.preventDefault();
      Loading.on();
      var formData = $(this).serialize();
      $.ajax({
        type: 'POST',
        url: $(this).attr('action'),
        data: formData,
        success: function (response) {
          console.log(response);
          if (typeof ctaLink !== 'undefined') {
            var downloadLink = GoogleDriveLink2Download.convert(ctaLink);
            openNewTab(downloadLink);
            alert('Agradecemos o seu interesse neste material!');
          } else {
            alert('Mensagem enviada com sucesso!');
          }
          Loading.off();
        }
      });
    });

  });

  // MASK
  function masks() {
    document.querySelectorAll('input.form-tel').forEach(function (input) {
      input.addEventListener('keyup', function (e) {
        var value = e.target.value.replace(/\D/g, '');
        if (value.length > 11) {
          value = value.slice(0, 11);
        }
        value = value.replace(/^(\d{2})(\d)/g, '($1) $2');
        if (value.length > 6) {
          value = value.replace(/(\d{4,5})(\d{4})$/, '$1-$2');
        }
        e.target.value = value;
      });

      input.addEventListener('blur', function (e) {
        var value = e.target.value.replace(/\D/g, '');
        if (value.length < 10) {
          e.target.value = '';
        }
      });
    });
  }

  // FAQ
  // Seleciona todos os checkboxes filhos de #faq
  var checkboxes = document.querySelectorAll('#faq input[type=checkbox]');
  // Remove o atributo checked de todos os checkboxes, exceto o primeiro
  for (var i = 1; i < checkboxes.length; i++) {
    checkboxes[i].checked = false;
  }
  // Garante que o primeiro checkbox esteja selecionado
  if (checkboxes.length > 0) {
    checkboxes[0].checked = true;
  }
});