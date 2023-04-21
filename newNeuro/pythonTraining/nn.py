import random 
import numpy as np 
import sys 
import os
sys.path.append(os.path.abspath("C:/Users/днс/Desktop/newNeuro/pythonTraining/"))
import mnistLoader

def sigmoid(z): 
    return 1.0/(1.0+np.exp(-z))

def sigmoid_prime(z):
    return sigmoid(z)*(1-sigmoid(z)) 
class Network(object): 
    def __init__(self, sizes): 
        self.num_layers = len(sizes) 
        self.sizes = sizes 
        self.biases = [np.random.randn(y, 1) for y in sizes[1:]] 
        self.weights = [np.random.randn(y, x) for x, y in zip(sizes[:-1], sizes[1:])]
    
    def feedforward(self, a):
        for b, w in zip(self.biases, self.weights):
            a = sigmoid(np.dot(w, a)+b)
        return a 

    def SGD(self, training_data, epochs, mini_batch_size, eta, test_data):
        test_data = list(test_data) 
        n_test = len(test_data) 
        training_data = list(training_data) 
        n = len(training_data) 
        for j in range(epochs): 
            random.shuffle(training_data) 
            mini_batches = [training_data[k:k+mini_batch_size] for k in range(0, n, mini_batch_size)] 
            for mini_batch in mini_batches: 
                self.update_mini_batch(mini_batch, eta) 
            print ("Epoch {0}: {1} / {2}".format(j, self.evaluate(test_data), n_test)) 

    def update_mini_batch(self, mini_batch, eta):
        nabla_b = [np.zeros(b.shape) for b in self.biases] 
        nabla_w = [np.zeros(w.shape) for w in self.weights] 
        for x, y in mini_batch:
            delta_nabla_b, delta_nabla_w = self.backprop(x, y) 
            nabla_b = [nb+dnb for nb, dnb in zip(nabla_b, delta_nabla_b)] 
            nabla_w = [nw+dnw for nw, dnw in zip(nabla_w, delta_nabla_w)] 
        self.weights = [w-(eta/len(mini_batch))*nw 
            for w, nw in zip(self.weights, nabla_w)]
        self.biases = [b-(eta/len(mini_batch))*nb
            for b, nb in zip(self.biases, nabla_b)] 

    def cost_derivative(self, output_activations, y): 
        return (output_activations-y) 

    def backprop(self, x, y):
        nabla_b = [np.zeros(b.shape) for b in self.biases] 
        nabla_w = [np.zeros(w.shape) for w in self.weights] 
        activation = x 
        activations = [x] 
        zs = [] 
        for b, w in zip(self.biases, self.weights):
            z = np.dot(w, activation)+b 
            zs.append(z) 
            activation = sigmoid(z) 
            activations.append(activation) 
        delta = self.cost_derivative(activations[-1], y) * sigmoid_prime(zs[-1])
        nabla_b[-1] = delta 
        nabla_w[-1] = np.dot(delta, activations[-2].transpose()) 
        for l in range(2, self.num_layers):
            z = zs[-l] 
            sp = sigmoid_prime(z) 
            delta = np.dot(self.weights[-l+1].transpose(), delta) * sp 
            nabla_b[-l] = delta 
            nabla_w[-l] = np.dot(delta, activations[-l-1].transpose())
        return (nabla_b, nabla_w) 

    def evaluate(self, test_data): 
        test_results = [(np.argmax(self.feedforward(x)), y)
            for (x, y) in test_data]
        return sum(int(x == y) for (x, y) in test_results) 



'''
training_data, validation_data, test_data = mnistLoader.load_data_wrapper() 
net = Network([784, 30, 10]) 
net.SGD(training_data, 1, 10, 3.0, test_data=test_data)
print('Сеть net:')
print('Количетво слоев:', net.num_layers)
for i in range(net.num_layers):
    print('Количество нейронов в слое', i,':',net.sizes[i])
for i in range(net.num_layers-1):
    print('W_',i+1,':')
    print("[") 
    for j in net.weights[i]:
        print("[", end="")
        for z in j:
            print(z, ", ", end="")
        print("], ")
    print("]")
    print('b_',i+1,':')
    print("[") 
    for j in net.biases[i]:
        print("[", end="")
        for z in j:
            print(z, ", ", end="")
        print("], ")
    print("]")
'''

training_data, validation_data, test_data = mnistLoader.load_data_wrapper() 
net = Network([784, 200, 10]) 
net.SGD(training_data, 20, 50, 10.0, test_data=test_data)

with open("C:/Users/днс/Desktop/newNeuro/pythonTraining/res.txt", 'w') as fp:
    fp.write('Network net:\n')
    fp.write('Amount of layers:' + str(net.num_layers) + "\n")
    for i in range(net.num_layers):
        fp.write('Amount of neurons in layer ' + str(i) + ':' + str(net.sizes[i]) + "\n")
    for i in range(net.num_layers-1):
        fp.write('W_' + str(i+1) + ':\n')
        fp.write("[\n") 
        for j in net.weights[i]:
            fp.write("[")
            for z in j:
                fp.write(str(z) + ", ")
            fp.write("], \n")
        fp.write("]\n")
        fp.write('b_' + str(i+1) +':\n')
        fp.write("[\n") 
        for j in net.biases[i]:
            fp.write("[")
            for z in j:
                fp.write(str(z) + ", ")
            fp.write("], \n")
        fp.write("]\n")
    fp.close()
