import _ from 'lodash'
import countryTemplate from '../templates/country.hbs'

import { alert } from '@pnotify/core';
import '@pnotify/core/dist/PNotify.css';
import '@pnotify/core/dist/Material.css';
import { defaults } from '@pnotify/core';
defaults.styling = 'material';
defaults.hide = 'true';
defaults.delay = '1000';
defaults.shadow = 'true';
defaults.animation = 'fade';


const refs = {
    input: document.getElementById('query-input'),
    list:document.getElementById('country-list')
}

refs.input.addEventListener('input', _.debounce(onInputChange, 500));



function onInputChange(e) {
    let inputValue = e.target.value;

    if (inputValue) {
        fetch(`https://restcountries.eu/rest/v2/name/${inputValue}?fields=name;capital;population;languages;flag`
        ).then(response => {

            return response.json()
            
        })
            .then(searchResult => {
                console.log(searchResult)
                if (searchResult.status === 404) {
                        alert({
                            type: 'error',
                            text: 'Nothing found',
                        });
                }
                refs.list.innerHTML = '';

                if (searchResult.length > 10) {
                    alert({
                        type: 'error',
                        text: 'Too many results! Refine your request',
                    });
                }
                if (searchResult.length <= 10 && searchResult.length > 1) {
                    const countries = searchResult.map(country => `<li>${country.name}</li>`).join('');
                    refs.list.insertAdjacentHTML('afterbegin', countries);
                }
                if (searchResult.length === 1) {
                    const markUp = countryTemplate(searchResult);
                    refs.list.insertAdjacentHTML('afterbegin', markUp);
                }
            }).catch(() => {
                alert({
                    type: 'error',
                    text: 'Too many results! Refine your request',
                });
            });
    }
}
