import neuronaut from "../assets/neuronaut.png";

const Neuronaut = ({ className }: { className?: string }) => (
  <img className={className} src={neuronaut} alt="neuronaut" />
);

export default Neuronaut;
