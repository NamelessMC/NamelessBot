import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-node';
import * as use from '@tensorflow-models/universal-sentence-encoder';
import { readFileSync } from 'fs';
import { MLData } from '../types';
import { join } from 'path';
export default class ML {

    private model!: tf.Sequential;
    private categories: number[] = [];
    private trainingData: MLData[] = [];

    constructor() {

    }

    public async train() {
        this.trainingData = JSON.parse(readFileSync(join(__dirname, '../../trainingData.json'), 'utf-8'));
        this.model = tf.sequential();
        const tensor = tf.tensor2d(this.create2dTensor(this.trainingData));
        const encodedData = await this.encodeData(this.trainingData);

        // Setup the model
        this.model.add(tf.layers.dense({
            inputShape: [512],
            activation: 'sigmoid',
            units: this.categories.length
        }));

        this.model.add(tf.layers.dense({
            activation: 'sigmoid',
            units: this.categories.length
        }));

        this.model.add(tf.layers.dense({
            activation: 'sigmoid',
            units: this.categories.length
        }));

        this.model.compile({
            loss: 'meanSquaredError',
            optimizer: tf.train.adam(.06)
        });

        // Train the model
        await this.model.fit(encodedData, tensor, { epochs: 200, shuffle: true });
    }

    public async predict(message: string) {
        const arr = [{ text: message }];
        const encodedData = await this.encodeData(arr);
        const result = (await (this.model.predict(encodedData) as any).array())[0]
        const max = result.reduce((a: number, b: number) => Math.max(a, b), -Infinity);
        const idx = result.indexOf(max);
        const category = this.categories[idx];

        return { category, value: max };
    }

    private create2dTensor(data: MLData[]) {
        data.forEach(value => {
            if (!this.categories.includes(value.category!)) this.categories.push(value.category!)
        });
        return data.map(value => this.categories.map(category => value.category === category ? 1 : 0));
    }

    private async encodeData(data: MLData[]) {
        const sentences = data.map(value => value.text.toLowerCase());
        const model = await use.load();
        const embeddings = await model.embed(sentences);
        return embeddings;
    }
}