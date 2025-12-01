import { fireEvent, render, waitFor } from '@testing-library/react-native';
import { Button, Text, View } from 'react-native';
import { act } from 'react-test-renderer';
import { Endereco } from '../../src/models/endereco';
import { Usuario } from '../../src/models/usuario';

const mockListarUsuarios = jest.fn();
const mockCriarUsuario = jest.fn();
const mockBuscarUsuario = jest.fn();
const mockAtualizarUsuario = jest.fn();
const mockDeletarUsuario = jest.fn();

const mockCriarEndereco = jest.fn();
const mockBuscarEnderecoPorUsuario = jest.fn();
const mockAtualizarEndereco = jest.fn();
const mockDeletarEndereco = jest.fn();

jest.mock('../../src/services/usuarioService', () => ({
  listarUsuarios: (...args: any[]) => mockListarUsuarios(...args),
  criarUsuario: (...args: any[]) => mockCriarUsuario(...args),
  buscarUsuario: (...args: any[]) => mockBuscarUsuario(...args),
  atualizarUsuario: (...args: any[]) => mockAtualizarUsuario(...args),
  deletarUsuario: (...args: any[]) => mockDeletarUsuario(...args),
}));

jest.mock('../../src/services/enderecoService', () => ({
  criarEndereco: (...args: any[]) => mockCriarEndereco(...args),
  buscarEnderecoPorUsuario: (...args: any[]) => mockBuscarEnderecoPorUsuario(...args),
  atualizarEndereco: (...args: any[]) => mockAtualizarEndereco(...args),
  deletarEndereco: (...args: any[]) => mockDeletarEndereco(...args),
}));

import { useUsuario } from '../use-usuario';

function TestHarness({
  usuarioParaAdicionar,
  enderecoParaAdicionar,
}: {
  usuarioParaAdicionar?: Usuario;
  enderecoParaAdicionar?: Partial<Endereco>;
}) {
  const { usuarios, carregando, adicionar, recarregar } = useUsuario();

  return (
    <View>
      <Text testID="carregando">{String(carregando)}</Text>
      <Text testID="usuarios">{JSON.stringify(usuarios)}</Text>

      <Button
        testID="recarregar"
        title="recarregar"
        onPress={() => recarregar()}
      />

      <Button
        testID="adicionar"
        title="adicionar"
        onPress={() =>
          adicionar(
            usuarioParaAdicionar ?? ({} as Usuario),
            (enderecoParaAdicionar ?? {}) as Endereco
          )
        }
      />
    </View>
  );
}

beforeEach(() => {
  jest.clearAllMocks();
});


test('recarregar() retorna o endereco correto do usuario', async () => {
  mockListarUsuarios.mockResolvedValueOnce([
    { id: 1, nome: 'Paulo', telefone: '4488888888', email: 'paulo@gmail.com', senha: '123456' },
  ]);

  mockBuscarEnderecoPorUsuario.mockResolvedValueOnce({
    id: 10,
    usuarioId: 1,
    cep: '12345-678',
    logradouro: 'Rua A',
    numero: '123',
    bairro: 'Bairro A',
    complemento: 'Apto 101',
    cidade: 'Cidade A',
    uf: 'PR'
  });

  const rendered = render(<TestHarness />);

  await act(async () => {
    fireEvent.press(rendered.getByTestId('recarregar'));
  });

  await waitFor(() => {
    expect(rendered.getByTestId('carregando').props.children).toBe('false');

    const usuariosText = rendered.getByTestId('usuarios').props.children as string;
    expect(usuariosText).toContain('Paulo');

    expect(mockListarUsuarios).toHaveBeenCalledTimes(1);
    expect(mockBuscarEnderecoPorUsuario).toHaveBeenCalledWith(1);
  });
});


test('adicionar() cria usuario e endereço', async () => {
  mockListarUsuarios
    .mockResolvedValueOnce([
      { id: 2, nome: 'Juca', telefone: '4488888888', email: 'juca@gmail.com', senha: '765432' },
    ])
    .mockResolvedValueOnce([
      { id: 1, nome: 'Paulo', telefone: '4488888888', email: 'paulo@gmail.com', senha: '123456' },
      { id: 2, nome: 'Juca', telefone: '4488888888', email: 'juca@gmail.com', senha: '765432' },
    ]);

  mockCriarUsuario.mockResolvedValueOnce(undefined);
  mockCriarEndereco.mockResolvedValueOnce(undefined);

  mockBuscarEnderecoPorUsuario.mockResolvedValueOnce({
    id: 20,
    usuarioId: 2,
    logradouro: 'Rua X',
    cidade: 'Cidade Y'
  });

  const usuarioToAdd: Usuario = {
    nome: 'Juca',
    telefone: '4488888888',
    email: 'juca@gmail.com',
    senha: '765432'
  };

  const enderecoToAdd: Partial<Endereco> = {
    cep: '12345-678',
    logradouro: 'Rua A',
    numero: '123',
    bairro: 'Bairro A',
    complemento: 'Apto 101',
    cidade: 'Cidade A',
    uf: 'PR'
  };

  const rendered = render(
    <TestHarness
      usuarioParaAdicionar={usuarioToAdd}
      enderecoParaAdicionar={enderecoToAdd}
    />
  );

  await act(async () => {
    fireEvent.press(rendered.getByTestId('adicionar'));
  });

  await waitFor(() => {
    expect(mockCriarUsuario).toHaveBeenCalledTimes(1);

    expect(mockCriarEndereco).toHaveBeenCalledTimes(1);

    const criarEnderecoArg = mockCriarEndereco.mock.calls[0][0];
    expect(criarEnderecoArg).toMatchObject({
      usuarioId: 2,
      logradouro: 'Rua A'
    });

    const usuariosText = rendered.getByTestId('usuarios').props.children as string;
    expect(usuariosText).toContain('Juca');
  });
});
