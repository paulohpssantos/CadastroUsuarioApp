import { UsuarioEntity } from "@/src/entities/usuarioEntity";
import { useUsuarios } from '../../../hooks/use-usuario';
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import colors from '../../../constants/colors';
import globalStyles from '../../../constants/globalStyles';
import { getEndereco } from "@/src/services/viaCepService";



const initialUsuarioForm: Partial<UsuarioEntity> = {
    nome: '',
    telefone: '',
    senha: '',
    email: '',
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
    const params = useLocalSearchParams();
    const { add, loading } = useUsuarios();
    const [form, setForm] = useState<Partial<UsuarioEntity>>(initialUsuarioForm);

    const handleChange = (field: keyof UsuarioEntity, value: string) => {
        setForm(prev => ({ ...prev, [field]: value }));
    };

    const handleSubmit = async () => {
        if (!form.nome) {
            Alert.alert('Atenção', 'Informe o nome do Usuário.');
            return;
        }
        if (!form.email) {
            Alert.alert('Atenção', 'Informe o email do Usuário.');
            return;
        }
        if (!form.senha) {
            Alert.alert('Atenção', 'Informe a senha do Usuário.');
            return;
        }
        if (!form.cep) {
            Alert.alert('Atenção', 'Informe o CEP do Usuário.');
            return;
        }
        if (!form.numero) {
            Alert.alert('Atenção', 'Informe o número do endereço.');
            return;
        }
        try {
            Alert.alert('Sucesso', 'Usuário cadastrado com sucesso!');
            router.replace('/screens/usuario');
        } catch (error) {
            Alert.alert('Erro', 'Falha ao cadastrar usuário');
        }
    };
    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <View style={[globalStyles.centeredContainer, { paddingTop: 20 }, { paddingBottom: 20 }]}>
                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    keyboardShouldPersistTaps="handled"
                >
                    <View style={globalStyles.formContainer}>
                        <Text style={{ marginBottom: 4, color: colors.text }}>Nome</Text>
                        <TextInput
                            placeholder="Nome"
                            value={form.nome}
                            onChangeText={v => handleChange('nome', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Telefone</Text>
                        <TextInput
                            placeholder="Telefone"
                            value={form.telefone}
                            onChangeText={v => handleChange('telefone', v)}
                            style={globalStyles.input}
                            keyboardType="numeric"
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Email</Text>
                        <TextInput
                            placeholder="Email"
                            value={form.email}
                            onChangeText={v => handleChange('email', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Senha</Text>
                        <TextInput
                            placeholder="Senha"
                            secureTextEntry
                            value={form.senha}
                            onChangeText={v => handleChange('senha', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>CEP</Text>
                        <TextInput
                            placeholder="CEP"
                            value={form.cep}
                            onChangeText={async v => {
                                handleChange('cep', v);
                                if (v.length === 8) {
                                    try {
                                        const endereco = await getEndereco(v);
                                        if (endereco && !endereco.erro) {
                                            setForm(prev => ({
                                                ...prev,
                                                logradouro: endereco.logradouro || '',
                                                uf: endereco.uf || '',
                                                municipio: endereco.localidade || '',
                                                bairro: endereco.bairro || ''
                                            }));
                                        }
                                    } catch (e) {
                                        console.error('Erro ao buscar endereço pelo CEP:', e);
                                    }
                                }
                            }}
                            style={globalStyles.input}
                            keyboardType="numeric"
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Logradouro</Text>
                        <TextInput
                            placeholder="Logradouro"
                            value={form.logradouro}
                            onChangeText={v => handleChange('logradouro', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Número</Text>
                        <TextInput
                            placeholder="Número"
                            value={form.numero}
                            onChangeText={v => handleChange('numero', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Complemento</Text>
                        <TextInput
                            placeholder="Complemento"
                            value={form.complemento}
                            onChangeText={v => handleChange('complemento', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>UF</Text>
                        <TextInput
                            placeholder="UF"
                            value={form.uf}
                            onChangeText={v => handleChange('uf', v)}
                            style={globalStyles.input}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Município</Text>
                        <TextInput
                            placeholder="Município"
                            value={form.cidade}
                            onChangeText={v => handleChange('cidade', v)}
                            style={globalStyles.input}
                        />

                    </View>
                </ScrollView>
                <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#eee', flexDirection: 'row', justifyContent: 'space-between', gap: 12 }}>
                    <Button
                        mode="outlined"
                        onPress={() => router.replace('/screens/usuario')}
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
