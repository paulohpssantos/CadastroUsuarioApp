import { getEndereco } from "@/src/services/viaCepService";
import { formatCelular, formatCEP, validaCEP, validaEmail, validaSenha } from "@/src/utils/functions";
import { MaterialCommunityIcons } from "@expo/vector-icons";
import * as Location from "expo-location";
import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useRef, useState } from 'react';
import { Alert, KeyboardAvoidingView, Platform, ScrollView, Text, TextInput, View } from 'react-native';
import { Button } from 'react-native-paper';
import { SafeAreaView } from 'react-native-safe-area-context';
import colors from '../../constants/colors';
import globalStyles from '../../constants/globalStyles';
import { useUsuario } from '../../hooks/use-usuario';
import { Endereco } from "../../src/models/endereco";
import { Usuario } from "../../src/models/usuario";



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
    const { adicionar, carregando, atualizar } = useUsuario();
    const [formUsuario, setFormUsuario] = useState<Partial<Usuario>>(initialUsuarioForm);
    const [formEndereco, setFormEndereco] = useState<Partial<Endereco>>(initialEnderecoForm);
    const [telefoneInput, setTelefoneInput] = useState(formatCelular(''));
    const [cepInput, setCepInput] = useState(formatCEP(''));
    const [exibeEndereco, setExibeEndereco] = useState(false);
    const nomeRef = useRef<TextInput | null>(null);
    const emailRef = useRef<TextInput | null>(null);
    const senhaRef = useRef<TextInput | null>(null);
    const cepRef = useRef<TextInput | null>(null);
    const numeroRef = useRef<TextInput | null>(null);
    const [erroNome, setErroNome] = useState(false);
    const [erroEmail, setErroEmail] = useState(false);
    const [erroSenha, setErroSenha] = useState(false);
    const [erroCep, setErroCep] = useState(false);
    const [erroNumero, setErroNumero] = useState(false);
    const params = useLocalSearchParams();
    const paramsKey = JSON.stringify(params || {});
    const [idUsuario, setIdUsuario] = useState<number | null>(null);

    useEffect(() => {
        setTelefoneInput(formatCelular(formUsuario.telefone ?? ''));
    }, [formUsuario.telefone]);

    useEffect(() => {
        setCepInput(formatCEP(formEndereco.cep ?? ''));
    }, [formEndereco.cep]);

    useEffect(() => {
        const { usuario: usuarioParam, endereco: enderecoParam } = params as any;
        if (usuarioParam) {
            try {
                const parsed = JSON.parse(decodeURIComponent(usuarioParam));

                setFormUsuario(prev => {
                    const next = {
                        ...prev,
                        nome: parsed.nome ?? prev.nome ?? '',
                        telefone: parsed.telefone ?? prev.telefone ?? '',
                        email: parsed.email ?? prev.email ?? '',
                        senha: parsed.senha ?? prev.senha ?? '',
                    } as Partial<Usuario>;
                    if (
                        prev.nome === next.nome &&
                        prev.telefone === next.telefone &&
                        prev.email === next.email &&
                        prev.senha === next.senha
                    ) {
                        return prev;
                    }
                    return next;
                });

                const newTel = formatCelular((parsed.telefone ?? '') as string);
                setTelefoneInput(prev => (prev === newTel ? prev : newTel));
                if (typeof parsed.id === 'number') setIdUsuario(parsed.id);
            } catch (e) {
                Alert.alert('Erro', 'Erro ao carregar dados de usuário.');
                console.warn('Erro ao exibir dados de usuário', e);
            }
        }
        if (enderecoParam) {
            try {
                const parsedE = JSON.parse(decodeURIComponent(enderecoParam));
                setFormEndereco(prev => {
                    const next = {
                        ...prev,
                        cep: parsedE.cep ?? prev.cep ?? '',
                        logradouro: parsedE.logradouro ?? prev.logradouro ?? '',
                        numero: parsedE.numero ?? prev.numero ?? '',
                        complemento: parsedE.complemento ?? prev.complemento ?? '',
                        bairro: parsedE.bairro ?? prev.bairro ?? '',
                        cidade: parsedE.cidade ?? prev.cidade ?? '',
                        uf: parsedE.uf ?? prev.uf ?? '',
                    } as Partial<Endereco>;
                    if (
                        prev.cep === next.cep &&
                        prev.logradouro === next.logradouro &&
                        prev.numero === next.numero &&
                        prev.complemento === next.complemento &&
                        prev.bairro === next.bairro &&
                        prev.cidade === next.cidade &&
                        prev.uf === next.uf
                    ) {
                        return prev;
                    }
                    return next;
                });

                const newCep = formatCEP((parsedE.cep ?? '') as string);
                setCepInput(prev => (prev === newCep ? prev : newCep));
                if (parsedE.cep) setExibeEndereco(true);

                if (!idUsuario && typeof parsedE.usuarioId === 'number') setIdUsuario(parsedE.usuarioId);
            } catch (e) {
                Alert.alert('Erro', 'Erro ao carregar dados de endereço.');
                console.warn('Erro ao exibir dados de endereco', e);
            }
        }
    }, [paramsKey]);

    const handleUsuarioChange = (campo: keyof Usuario, value: string) => {
        setFormUsuario(prev => ({ ...prev, [campo]: value }));
        if (campo === 'nome') setErroNome(false);
        if (campo === 'email') setErroEmail(false);
        if (campo === 'senha') setErroSenha(false);
    };
    const handleEnderecoChange = (campo: keyof Endereco, value: string) => {
        setFormEndereco(prev => ({ ...prev, [campo]: value }));
        if (campo === 'cep') setErroCep(false);
        if (campo === 'numero') setErroNumero(false);
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
            setErroNome(true);
            nomeRef.current?.focus();
            return;
        }
        if (!formUsuario.email) {
            setErroEmail(true);
            emailRef.current?.focus();
            return;
        }
        if (!formUsuario.senha) {
            setErroSenha(true);
            senhaRef.current?.focus();
            return;
        }
        if (!formEndereco.cep) {
            setErroCep(true);
            cepRef.current?.focus();
            return;
        }
        if (!formEndereco.numero) {
            setErroNumero(true);
            numeroRef.current?.focus();
            return;
        }
        if (!validaEmail(formUsuario.email!)) {
            Alert.alert('Atenção', 'Email inválido.');
            setErroEmail(true);
            emailRef.current?.focus();
            return;
        }
        if (!validaSenha(formUsuario.senha!)) {
            Alert.alert('Atenção', 'Senha deve ter no mínimo 6 caracteres.');
            setErroSenha(true);
            senhaRef.current?.focus();
            return;
        }
        if (!validaCEP(formEndereco.cep!)) {
            Alert.alert('Atenção', 'CEP inválido.');
            setErroCep(true);
            cepRef.current?.focus();
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
            if (idUsuario) {
                const enderecoForUpdate: any = { ...enderecoPayload };
                delete enderecoForUpdate.usuarioId;

                await atualizar(idUsuario, usuarioPayload, enderecoForUpdate);
                Alert.alert('Sucesso', 'Usuário atualizado!');
            } else {
                await adicionar(usuarioPayload, enderecoPayload);
                Alert.alert('Sucesso', 'Usuário cadastrado!');
            }
            router.replace('/usuario' as any);
        } catch (error) {
            Alert.alert('Erro', 'Falha ao salvar usuário');
            console.error('Erro ao salvar usuário:', error);
        }
    };

    const pegarLocalizacao = async () => {
        try {
            const { status } = await Location.requestForegroundPermissionsAsync();

            if (status !== "granted") {
                Alert.alert("Permissão negada", "É necessário permitir o acesso à localização.");
                return;
            }
            const local = await Location.getCurrentPositionAsync({
                accuracy: Location.Accuracy.Highest,
            });

            const { latitude, longitude } = local.coords;

            const geo = await Location.reverseGeocodeAsync({
                latitude,
                longitude,
            });

            if (geo.length > 0) {
                const e = geo[0];

                setFormEndereco(prev => ({
                    ...prev,
                    cep: e.postalCode,
                    logradouro: e.street || '',
                    uf: e.region || '',
                    cidade: e.city || '',
                    bairro: e.district || ''
                }));

                setExibeEndereco(true);
            }

        } catch (error) {
            console.log(error);
            Alert.alert("Erro", "Não foi possível obter a localização.");
        }
    };


    return (
        <KeyboardAvoidingView
            style={{ flex: 1 }}
            behavior={Platform.OS === "ios" ? "padding" : undefined}
        >
            <SafeAreaView style={[globalStyles.centeredContainer, { paddingTop: 20 }, { paddingBottom: 50 }]}>

                <Text style={globalStyles.title}>{idUsuario ? 'Dados do Usuário' : 'Novo Usuário'}</Text>
                <ScrollView
                    style={{ width: '100%' }}
                    contentContainerStyle={{ paddingBottom: 32 }}
                    keyboardShouldPersistTaps="handled"
                >


                    <View style={[globalStyles.formContainer, { marginTop: 16}]}>
                        <Text style={{ marginBottom: 4, color: colors.text }}>Nome*</Text>
                        <TextInput
                            ref={nomeRef}
                            placeholder="Nome"
                            value={formUsuario.nome ?? ''}
                            onChangeText={v => handleUsuarioChange('nome', v)}
                            style={[globalStyles.input, erroNome ? { borderColor: 'red', borderWidth: 1 } : {}]}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Telefone*</Text>
                        <TextInput
                            placeholder="Telefone"
                            value={telefoneInput}
                            onChangeText={v => handleTelefoneChange(v)}
                            style={globalStyles.input}
                            keyboardType={Platform.OS === 'ios' ? 'phone-pad' : 'phone-pad'}
                            maxLength={15}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Email*</Text>
                        <TextInput
                            ref={emailRef}
                            placeholder="Email"
                            value={formUsuario.email ?? ''}
                            onChangeText={v => handleUsuarioChange('email', v)}
                            style={[globalStyles.input, erroEmail ? { borderColor: 'red', borderWidth: 1 } : {}]}
                        />
                        <Text style={{ marginBottom: 4, color: colors.text }}>Senha*</Text>
                        <TextInput
                            ref={senhaRef}
                            placeholder="Senha"
                            secureTextEntry
                            value={formUsuario.senha ?? ''}
                            onChangeText={v => handleUsuarioChange('senha', v)}
                            style={[globalStyles.input, erroSenha ? { borderColor: 'red', borderWidth: 1 } : {}]}
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
                            onPress={pegarLocalizacao}
                            style={globalStyles.radiusButton}>
                            Usar minha localização
                        </Button>

                        <Text style={{ marginBottom: 4, color: colors.text }}>CEP*</Text>
                        <TextInput
                            ref={cepRef}
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
                            style={[globalStyles.input, erroCep ? { borderColor: 'red', borderWidth: 1 } : {}]}
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
                                <Text style={{ marginBottom: 4, color: colors.text }}>Número*</Text>
                                <TextInput
                                    ref={numeroRef}
                                    placeholder="Número"
                                    value={formEndereco.numero ?? ''}
                                    onChangeText={v => handleEnderecoChange('numero', v)}
                                    style={[globalStyles.input, erroNumero ? { borderColor: 'red', borderWidth: 1 } : {}]}
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
                <Text style={{ marginBottom: 4, marginTop: 8, color: colors.text, alignSelf: 'flex-start', textAlign: 'left' }}>* Campos obrigatórios</Text>
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
            </SafeAreaView>
        </KeyboardAvoidingView>
    );
}
