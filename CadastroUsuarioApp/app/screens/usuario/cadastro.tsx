import { Usuario } from "../../../src/models/usuario";
import { Endereco } from "../../../src/models/endereco";
import { useUsuario } from '../../../hooks/use-usuario';
import { useRouter } from 'expo-router';
import React, { useState, useEffect } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import colors from '../../../constants/colors';
import globalStyles from '../../../constants/globalStyles';
import { getEndereco } from "@/src/services/viaCepService";
import { formatCelular, validaEmail, validaSenha, formatCEP } from "@/src/utils/functions";
import { MaterialCommunityIcons } from "@expo/vector-icons";



const initialUsuarioForm: Partial<Usuario> = {
    nome: '',
    telefone: '',
    senha: '',
    email: '',
};

const initialEnderecoForm: Partial<Endereco> = {
    logradouro: '',
    numero: '',
    bairro: '',
    cep: '',
    uf: '',
    cidade: '',
    complemento: '',
};

export default function NovoUsuario() {
    const router = useRouter();
    const { adicionar, carregando } = useUsuario();
    const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>(initialUsuarioForm);
    const [formEndereco, setFormEndereco] = useState<Partial<Endereco>>(initialEnderecoForm);
    const [telefoneInput, setTelefoneInput] = useState(formatCelular(''));
    const [cepInput, setCepInput] = useState(formatCEP(''));
    const [exibeEndereco, setExibeEndereco] = useState(false);


    useEffect(() => {
        setTelefoneInput(formatCelular(formUsuario.telefone ?? ''));
    }, [formUsuario.telefone]);

    useEffect(() => {
        setCepInput(formatCEP(formEndereco.cep ?? ''));
    }, [formEndereco.cep]);

    const handleUsuarioChange = (field: keyof Usuario, value: string) => {
        setFormUsuario(prev => ({ ...prev, [field]: value }));
    };
    const handleEnderecoChange = (field: keyof Endereco, value: string) => {
        setFormEndereco(prev => ({ ...prev, [field]: value }));
    };

    const handleTelefoneChange = (v: string) => {
        const onlyNums = v.replace(/\D/g, '');
        setTelefoneInput(formatCelular(onlyNums));
        handleUsuarioChange('telefone', onlyNums);
    };

    const handleCepChange = (v: string) => {
        if (v.length < 9)
            setExibeEndereco(false);

        const onlyNums = v.replace(/\D/g, '');
        setCepInput(formatCEP(onlyNums));
        handleEnderecoChange('cep', onlyNums);
    };

    const handleSubmit = async () => {
        if (!formUsuario.nome) {
            Alert.alert('Atenção', 'Informe o nome do Usuário.');
            return;
        }
        if (!formUsuario.email) {
            Alert.alert('Atenção', 'Informe o email do Usuário.');
            return;
        }
        if (!formUsuario.senha) {
            Alert.alert('Atenção', 'Informe a senha do Usuário.');
            return;
        }
        if (!formEndereco.cep) {
            Alert.alert('Atenção', 'Informe o CEP do Usuário.');
            return;
        }
        if (!formEndereco.numero) {
            Alert.alert('Atenção', 'Informe o número do endereço.');
            return;
        }



        const usuarioPayload: Usuario = {
            nome: formUsuario.nome!,
            telefone: formUsuario.telefone ?? null,
            email: formUsuario.email!,
            senha: formUsuario.senha!
        };

        const enderecoPayload: Endereco = {
            usuarioId: 0,
            cep: formEndereco.cep ?? null,
            logradouro: formEndereco.logradouro ?? null,
            numero: formEndereco.numero ?? null,
            complemento: formEndereco.complemento ?? null,
            bairro: formEndereco.bairro ?? null,
            cidade: formEndereco.cidade ?? null,
            uf: formEndereco.uf ?? null,
        };

        try {
            await adicionar(usuarioPayload, enderecoPayload);
            Alert.alert('Sucesso', 'Usuário cadastrado!');
            router.replace('/usuario' as any);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao cadastrar usuário');
            console.error('Erro ao adicionar usuário:', error);
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={[globalStyles.centeredContainer, { paddingTop: 20 }, { paddingBottom: 100 }]}>
                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={globalStyles.formContainer}>
                        <Text style={{ marginBottom: 4, color: colors.text }}>Nome</Text>
                        <TextInput
                            placeholder="Nome"
                            value={formUsuario.nome ?? ''}
                            onChangeText={v => handleUsuarioChange('nome', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Telefone</Text>
                        <TextInput
                            placeholder="Telefone"
                            value={telefoneInput}
                            onChangeText={v => handleTelefoneChange(v)}
                            style={globalStyles.input}
                            keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'phone-pad'}
                            maxLength={15}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Email</Text>
                        <TextInput
                            placeholder="Email"
                            value={formUsuario.email ?? ''}
                            onChangeText={v => handleUsuarioChange('email', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Senha</Text>
                        <TextInput
                            placeholder="Senha"
                            secureTextEntry
                            value={formUsuario.senha ?? ''}
                            onChangeText={v => handleUsuarioChange('senha', v)}
                            style={globalStyles.input}
                        />

                        <View
                            style={{
                                borderBottomWidth: 1,
                                borderBottomColor: colors.border,
                                marginVertical: 12,
                            }}
                        />
                        {/* Endereço */}
                        <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.text, marginBottom: 8 }}>
                            <MaterialCommunityIcons name="map-marker-outline" size={22} color={colors.primary} /> Endereço
                        </Text>

                        <Button
                            mode="contained"
                            icon="target"
                            onPress={() => {}}
                            style={globalStyles.radiusButton}>
                            Usar minha localização
                        </Button>

                        <Text style={{ marginBottom: 4, color: colors.text }}>CEP</Text>
                        <TextInput
                            placeholder="CEP"
                            value={cepInput}
                            onChangeText={async v => {
                                handleCepChange(v);
                                if (v.length === 8) {
                                    try {
                                        const endereco = await getEndereco(v);
                                        if (endereco && !endereco.erro) {
                                            setExibeEndereco(true);
                                            setFormEndereco(prev => ({
                                                ...prev,
                                                logradouro: endereco.logradouro || '',
                                                uf: endereco.uf || '',
                                                cidade: endereco.localidade || '',
                                                bairro: endereco.bairro || ''
                                            }));
                                        } else {
                                            Alert.alert('Atenção', 'Endereço não encontrado para o CEP informado.');
                                        }
                                    } catch (e) {
                                        Alert.alert('Erro', 'Erro ao buscar endereço pelo CEP.');
                                        console.error('Erro ao buscar endereço pelo CEP:', e);
                                    }
                                }
                            }}
                            style={globalStyles.input}
                            keyboardType="numeric"
                        />

                        {exibeEndereco && (
                            <View>
                                <Text style={{ marginBottom: 4, color: colors.text }}>Logradouro</Text>
                                <TextInput
                                    placeholder="Logradouro"
                                    value={formEndereco.logradouro ?? ''}
                                    onChangeText={v => handleEnderecoChange('logradouro', v)}
                                    style={globalStyles.input}
                                />
                                <Text style={{ marginBottom: 4, color: colors.text }}>Número</Text>
                                <TextInput
                                    placeholder="Número"
                                    value={formEndereco.numero ?? ''}
                                    onChangeText={v => handleEnderecoChange('numero', v)}
                                    style={globalStyles.input}
                                />
                                <Text style={{ marginBottom: 4, color: colors.text }}>Complemento</Text>
                                <TextInput
                                    placeholder="Complemento"
                                    value={formEndereco.complemento ?? ''}
                                    onChangeText={v => handleEnderecoChange('complemento', v)}
                                    style={globalStyles.input}
                                />
                                <Text style={{ marginBottom: 4, color: colors.text }}>UF</Text>
                                <TextInput
                                    placeholder="UF"
                                    value={formEndereco.uf ?? ''}
                                    onChangeText={v => handleEnderecoChange('uf', v)}
                                    style={globalStyles.input}
                                />
                                <Text style={{ marginBottom: 4, color: colors.text }}>Município</Text>
                                <TextInput
                                    placeholder="Cidade"
                                    value={formEndereco.cidade ?? ''}
                                    onChangeText={v => handleEnderecoChange('cidade', v)}
                                    style={globalStyles.input}
                                />
                            </View>
                        )}



                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                    <Button
                        mode="outlined"
                        onPress={() => router.replace('/usuario' as any)}
                        labelStyle={{ color: colors.primary }}
                        style={[globalStyles.secondaryButton, { flex: 1 }]}
                    >
                        Cancelar
                    </Button>
                    <Button mode="contained" onPress={handleSubmit} style={[globalStyles.primaryButton, { flex: 1 }]}>
                        Salvar
                    </Button>
                </View>
            </View>
        </KeyboardAvoidingView>
    );
}
