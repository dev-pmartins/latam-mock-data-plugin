// Itens que podem aparecer no menu de contexto rápido (Compact mode).
// A ordem desta lista é a ordem no menu. `field` é a chave do campo gerado;
// `action` executa uma ação em vez de gerar um único valor.

export const QUICK_ITEMS = [
  { id: 'auto', label: 'Detectar campo automaticamente', action: 'auto' },
  { id: 'fill-form', label: 'Preencher formulário inteiro', action: 'fill-form' },
  { id: 'fullName', label: 'nome', field: 'fullName' },
  { id: 'firstName', label: 'primeiro nome', field: 'firstName' },
  { id: 'lastName', label: 'sobrenome', field: 'lastName' },
  { id: 'birthDate', label: 'data de nascimento', field: 'birthDate' },
  { id: 'motherName', label: 'nome da mãe', field: 'motherName' },
  { id: 'email', label: 'e-mail', field: 'email' },
  { id: 'mobile', label: 'telefone', field: 'mobile' },
  { id: 'phone', label: 'telefone fixo', field: 'phone' },
  { id: 'doc:person', label: 'documento', doc: 'person' },
  { id: 'doc:company', label: 'documento da empresa', doc: 'company' },
  { id: 'companyName', label: 'razão social', field: 'companyName' },
  { id: 'postalCode', label: 'CEP / código postal', field: 'postalCode' },
  { id: 'street', label: 'logradouro', field: 'street' },
  { id: 'fullAddress', label: 'endereço completo', field: 'fullAddress' },
  { id: 'city', label: 'cidade', field: 'city' },
  { id: 'plate', label: 'placa', field: 'plate' },
  { id: 'vin', label: 'chassi (VIN)', field: 'vin' },
  { id: 'cardNumber', label: 'cartão de crédito', field: 'cardNumber' },
  { id: 'username', label: 'usuário', field: 'username' },
  { id: 'password', label: 'senha', field: 'password' },
];

export const DEFAULT_QUICK_ITEMS = ['fullName', 'email', 'mobile', 'doc:person'];

// Encontra no perfil o campo correspondente ao item (documentos variam por país).
export function resolveQuickField(item, fields) {
  if (item.doc) return fields.find((f) => f.doc && f.main && f.kind === item.doc);
  return fields.find((f) => f.key === item.field);
}

// Título no menu: ações pelo nome; campos como "Gerar: x" (documento inclui o tipo do país).
export function quickTitle(item, fields) {
  if (item.action) return item.label;
  const field = resolveQuickField(item, fields);
  return item.doc ? `Gerar: ${item.label} (${field.label})` : `Gerar: ${item.label}`;
}
