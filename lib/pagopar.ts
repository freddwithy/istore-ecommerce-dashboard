import * as crypto from 'crypto';
import { env } from 'process';

const generateToken = (privateKey: string, idPedido: string, montoTotal: number) => {
  const data = privateKey + idPedido + montoTotal;
  const sha1Hash = crypto.createHash('sha1').update(data).digest('hex');
  return sha1Hash;
};

// Ejemplo de uso
const comercioTokenPrivado = env.PAGOPAR_COMERCIO_TOKEN_PRIVADO || '';
const idPedido = '123';
const montoTotal = 100.00;

const token = generateToken(comercioTokenPrivado, idPedido, montoTotal);
console.log(token);
