export const initParams = {
  num_iterations: 10,
  num_repeats: 4,
  layer_tensor_index: 5,
  step_size: 3,
  rescale_factor: 0.7,
  blend: 0.2,
} as const

export type paramName = keyof typeof initParams
