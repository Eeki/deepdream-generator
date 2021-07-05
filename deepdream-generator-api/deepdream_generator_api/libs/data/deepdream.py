from dataclasses import dataclass, asdict


@dataclass
class DeepdreamParams:
    num_iterations: int = 10
    num_repeats: int = 4
    layer_tensor_index: int = 4
    step_size: float = 3.0
    rescale_factor: float = 0.7
    blend: float = 0.2

    def as_dict(self):
        return asdict(self)
