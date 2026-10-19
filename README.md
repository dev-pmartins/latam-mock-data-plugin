# Gerador de Dados de Teste — América do Sul

Extensão para Google Chrome (Manifest V3) que gera dados fictícios no formato de cada país
da América do Sul, para uso em homologação.

## Instalação (modo desenvolvedor)

1. Abra `chrome://extensions`.
2. Ative **Modo do desenvolvedor** (canto superior direito).
3. Clique em **Carregar sem compactação** e selecione esta pasta.
4. Fixe a extensão na barra (ícone de quebra-cabeça → alfinete).

Após alterar o código, clique em **↻ Recarregar** no card da extensão.

## Uso

- **Popup**: pesquise e selecione o país. A escolha fica salva e passa a valer para o popup,
  o menu de contexto e os atalhos até você trocar. Clique em qualquer valor para copiá-lo.
  Os dados exibidos continuam os mesmos ao reabrir o popup; use **Gerar** para criar novos.
- **Menu de contexto**: clique com o botão direito em um campo → **Gerar dados — país**.
  Por padrão o **Compact mode** fica ativo (em Configurações, no popup) e o menu mostra apenas
  *Gerar: nome*, *Gerar: e-mail*, *Gerar: telefone* e *Gerar: documento* (o documento principal
  do país, ex.: CPF, DNI, RUT). Em **Itens do menu rápido** você escolhe quais tipos aparecem
  (a lista fica em `lib/quick-menu.js`). Com o modo compacto desligado, o menu completo traz:
  - *Detectar campo automaticamente*: identifica o campo por label, placeholder, `name`, `id`
    e `autocomplete`.
  - *Preencher formulário inteiro*: preenche todos os campos reconhecidos com uma mesma pessoa
    (nome, documentos, endereço etc. coerentes entre si).
  - Submenus por grupo (Pessoa, Documentos, Contato…) para escolher o tipo exato.
  - *Trocar país* e *Usar máscara* também ficam disponíveis no menu.
- **Atalhos**: `Alt+Shift+G` (campo focado) e `Alt+Shift+F` (formulário). Podem ser
  alterados em `chrome://extensions/shortcuts`.

## Dados por país

| País | Documentos | Validação |
|---|---|---|
| 🇧🇷 Brasil | CPF, RG (SSP-SP), CNH, PIS/PASEP, Título de eleitor, CNPJ, RENAVAM | dígitos verificadores |
| 🇦🇷 Argentina | DNI, CUIL (derivado do DNI), CUIT | dígito verificador (CUIL/CUIT) |
| 🇨🇱 Chile | RUT/RUN, RUT empresa | dígito verificador (módulo 11, aceita K) |
| 🇨🇴 Colômbia | Cédula de ciudadanía, NIT | dígito verificador (NIT) |
| 🇵🇪 Peru | DNI, RUC pessoa (10 + DNI), RUC empresa (20…) | dígito verificador (RUC) |
| 🇺🇾 Uruguai | Cédula de identidad, RUT | dígitos verificadores |
| 🇵🇾 Paraguai | Cédula, RUC pessoa (derivado da CI), RUC empresa | dígito verificador (RUC) |
| 🇪🇨 Equador | Cédula (com província), RUC pessoa, RUC sociedade | dígitos verificadores |
| 🇻🇪 Venezuela | Cédula, RIF pessoa, RIF empresa | dígito verificador (RIF) |
| 🇧🇴 Bolívia | CI com extensão do departamento, NIT | apenas formato |
| 🇬🇾 Guiana | National ID, Passport, TIN | apenas formato |
| 🇸🇷 Suriname | ID-nummer, CRIB | apenas formato |

Todos os países também geram: nome completo (nomes e sobrenomes comuns de cada país;
dois sobrenomes nos países que usam *apellido paterno + materno*), sexo, data de nascimento,
nome da mãe, e-mail, celular e telefone fixo com DDD/código de área coerente com a cidade,
endereço (CEP/código postal quando o país usa), razão social, placa no padrão local,
chassi (VIN válido), cartão de crédito de teste (Luhn), usuário e senha.

> Os documentos são matematicamente válidos, mas fictícios: não correspondem a pessoas ou
> empresas reais cadastradas. Use somente em ambientes de teste.

## Estrutura

```
manifest.json          configuração da extensão
background.js          service worker: menu de contexto e atalhos
content.js             detecta o campo e insere o valor (compatível com React/Vue/Angular)
popup/                 interface do popup
lib/generator.js       monta o perfil coerente e as regras de detecção de campos
lib/names.js           nomes e sobrenomes por país
lib/countries/*.js     um módulo por país (documentos, telefones, cidades, placas…)
tests/                 testes dos dígitos verificadores (npm test)
```

### Adicionando um país

1. Crie `lib/countries/xx.js` seguindo o formato de um país existente.
2. Adicione os nomes em `lib/names.js` com a mesma sigla.
3. Registre o módulo em `lib/countries/index.js` e o nome alternativo em `COUNTRY_ALTS`
   (`lib/generator.js`).
4. Rode `npm test`.
