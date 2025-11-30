import { useUsuario } from '../../../hooks/use-usuario';
import { Usuario } from "../../../src/models/usuario";
import { Endereco } from "../../../src/models/endereco";
import { MaterialCommunityIcons, MaterialIcons } from '@expo/vector-icons';
import { useFocusEffect, useRouter } from 'expo-router';
import React from 'react';
import { Alert, FlatList, Text, TouchableOpacity, View } from 'react-native';
import { Button, Card, IconButton, Provider as PaperProvider } from 'react-native-paper';
import colors from "../../../constants/colors";
import globalStyles from '../../../constants/globalStyles';
import { formatCelular } from '../../../src/utils/functions';




export default function UsuariosScreen() {
  const router = useRouter();
  const { usuarios, carregando, recarregar, remover } = useUsuario();

    useFocusEffect(
    React.useCallback(() => {
        recarregar();
    }, [])
    );

  
  function renderCard(usuario: Usuario, endereco: Endereco) {
    const handleDelete = () => {
      Alert.alert(
        'Confirmar exclusão',
        'Deseja realmente deletar este usuário?',
        [
          { text: 'Cancelar', style: 'cancel' },
          {
            text: 'Deletar',
            style: 'destructive',
            onPress: async () => {
              try {
                if (usuario.id) {
                  await remover(usuario.id);
                } else {
                  Alert.alert('Erro', 'ID do usuário inválido.');
                }
              } catch (e) {
                Alert.alert('Erro', 'Não foi possível deletar o usuário.');
              }
            }
          }
        ]
      );
    };

    return (
      <Card style={{ marginBottom: 18, borderRadius: 18, backgroundColor: colors.background, shadowColor: '#000', shadowOpacity: 0.04, shadowRadius: 8, elevation: 2 }}>
        <View style={{ flexDirection: 'row', alignItems: 'center', padding: 18, paddingBottom: 10 , backgroundColor: colors.accent}}>
          <View style={{ backgroundColor: colors.primary, borderRadius: 16, padding: 12, marginRight: 14 }}>
            <MaterialIcons name="person-outline" size={32} color={colors.background} />
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ fontWeight: 'bold', fontSize: 18, color: colors.text, marginBottom: 2 }}>{usuario.nome}</Text>
            
          </View>
          <View style={{ flexDirection: 'row', gap: 2 }}>
            <IconButton
              icon="pencil-outline"
              size={22}
              onPress={() => router.push({ pathname: '/usuario/cadastro', params: { cliente: JSON.stringify(usuario) } } as any)}
            />
            <IconButton icon="delete-outline" size={22} onPress={handleDelete} />
          </View>
        </View>
        <View style={{ borderTopWidth: 1, borderColor: '#f0f0f0', padding: 16, paddingTop: 10 }}>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <MaterialCommunityIcons name="phone-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.text, fontSize: 15, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">{formatCelular(usuario.telefone ?? '')}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <MaterialCommunityIcons name="email-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.text, fontSize: 15 }}>{usuario.email}</Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6 }}>
            <MaterialCommunityIcons name="map-marker-outline" size={18} color={colors.primary} style={{ marginRight: 6 }} />
            <Text style={{ color: colors.text, fontSize: 15, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">
              {`${endereco.logradouro ?? ''}${endereco.numero ? ', ' + endereco.numero : ''}${endereco.bairro ? ' - ' + endereco.bairro : ''}`}
            </Text>
          </View>
          <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 6, paddingStart: 24 }}>
            <Text style={{ color: colors.text, fontSize: 15, flex: 1 }} numberOfLines={1} ellipsizeMode="tail">
              {`${endereco.cidade ?? ''}${endereco.uf ? '/' + endereco.uf : ''}`}
            </Text>
          </View>
          {}
        </View>
      </Card>
    );
  }

  return (
    <PaperProvider>
      <View style={globalStyles.container}>
        <View style={{ height: 18 }} />
        {carregando ? (
          <Text style={{ textAlign: 'center', marginTop: 30 }}>Carregando...</Text>
        ) : (
          <FlatList
            style={{ flex: 1 }}
            contentContainerStyle={{ paddingBottom: 80 }}
            data={usuarios}
            keyExtractor={(item, idx) => String((item as any)?.id ?? idx)}
            renderItem={({ item }) => renderCard(item.usuario, item.endereco)}
            ListEmptyComponent={<Text style={{ textAlign: 'center', marginTop: 30 }}>Nenhum cliente encontrado.</Text>}
            showsVerticalScrollIndicator={false}
          />
        )}
      </View>
      <View style={{ position: 'absolute', left: 0, right: 0, bottom: 0, padding: 16, backgroundColor: '#fff', borderTopWidth: 0.5, borderColor: '#eee', flexDirection: 'row', justifyContent: 'center', gap: 12 }}>
        <Button
          mode="contained"
          icon="plus"
          onPress={() => router.push({ pathname: '/usuario/cadastro' } as any)}
          style={globalStyles.primaryButton}>
          Novo Usuário
        </Button>
      </View>
    </PaperProvider>
  );
}
