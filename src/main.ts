import * as core from '@actions/core'
// import Ajv from "ajv"
import Ajv from 'ajv/dist/2020';
import * as fs from 'node:fs'
import path from 'node:path'
import addFormats from "ajv-formats"

/**
 * The main function for the action.
 *
 * @returns Resolves when the action is complete.
 */
export async function run(): Promise<void> {
  try {
    // Debug logs are only output if the `ACTIONS_STEP_DEBUG` secret is true
    core.debug(`Running the action ...`)


    const ajv = new Ajv({
      allErrors: true,
      strict: true,
      strictSchema: true,
      strictNumbers: true,
      strictTypes: true,
      strictTuples: true,
      strictRequired: true,
      verbose: true,
      validateFormats: true,
    });

    addFormats(ajv)



    // let apisConfigContent: string = await fsp.readFile("subscription-schema.yaml", { encoding: "utf8" });
    // const schema = JSON.parse(fs.readFileSync('subscription.schema.json', 'utf8'));
    // let instance = JSON.parse(fs.readFileSync('data.json', 'utf8'));

    const schemaDir = path.join(process.cwd(), 'src');

    const subscriptionSchema = JSON.parse(fs.readFileSync(path.join(schemaDir, 'subscription.schema.json'), 'utf8'));
    const productSchema = JSON.parse(fs.readFileSync(path.join(schemaDir, 'product.schema.json'), 'utf8'));

    // let instance = JSON.parse(fs.readFileSync(path.join(schemaDir, 'data-invalid.json'), 'utf8'));
    let instance = JSON.parse(fs.readFileSync(path.join(schemaDir, 'data.json'), 'utf8'));

    try {
      const validate = ajv.addSchema(productSchema)
        .compile(subscriptionSchema)

      // const validate = ajv.compile()
      // const validate = ajv.getSchema<Subscription>("user")

      // const validate = new Ajv().addSchema(schema).addFormat(name, regex).getSchema(uri)

      const valid = validate(instance)

      console.log({ valid: valid, error: validate.errors })
    } catch ({ message }) {
      console.error(message)
    }
  } catch (error: any) {
    // console.error(`An error occurred: ${error.message}`);
    if (error instanceof Error)
      core.setFailed(error.message)
  }
}

interface Product {
  name: string
  id: string
}

interface Subscription {
  name: string
  product?: Product
  apis: string[]
}
