// 这是一个临时文件，用于禁用 Next-Auth
// 当需要重新启用 Next-Auth 时，只需删除此文件并恢复原始配置

export const handlers = {
  GET: async () => new Response(JSON.stringify({ disabled: true }), { status: 200 }),
  POST: async () => new Response(JSON.stringify({ disabled: true }), { status: 200 }),
};

export const signIn = async () => null;
export const signOut = async () => null;
export const auth = async () => null;
