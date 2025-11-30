export function formatCelular(value: string) {
  if (!value) return '';
  const digits = value.replace(/\D/g, '');
  return digits.replace(/^(\d{2})(\d{5})(\d{4}).*/, '($1)$2-$3');
}

export function validaEmail(email: string): boolean {
  const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return re.test(email.toLowerCase());
}

export function validaSenha(senha: string): boolean {
  return senha.length >= 6;
}

export function validaCEP(cep: string): boolean {
  return cep.length === 8;
}

export function formatCEP(value: string) {
  const digits = value.replace(/\D/g, '');
  return digits.replace(/^(\d{5})(\d{3}).*/, '$1-$2');
}