/// Exporting directly due to function build error
import { promises as fs } from 'fs';
import inquirer from "inquirer"
import "dotenv/config";

export async function fileExists(path) {
    try {
        await fs.access(path)
        return true
    } catch (e) {
        return false
    }
}

export function validateDeploymentInfo(deployInfo) {
    
    if (Object.keys(deployInfo).length == 0) {
        throw new Error('loaded book has no contract info registered')
    }
    /*
    const chainRequired = arg => {
        if (!deployInfo.name.hasOwnProperty(arg)) {
            throw new Error(`required field "contractName.${arg}" not found`)
        }
    }
    */

    //chainRequired('chain')
}


export async function loadData(path, filename) {
    let deploymentConfigFile  = path 
    if (!deploymentConfigFile) {
        console.log(`no deploymentConfigFile field found in standard deployment config. attempting to read from default path "./${filename}"`)
        deploymentConfigFile = filename
    }
    const content = await fs.readFile(deploymentConfigFile, { encoding: 'utf8' })
    const deployInfo = JSON.parse(content)
    try {
        validateDeploymentInfo(deployInfo)
    } catch (err) {
        throw new Error(`error reading deploy info from ${deploymentConfigFile}: ${err}`)
    }
    return deployInfo
}


export async function getDatum(contract, chain, path, filename) {
    const exists = await fileExists(filename)
    if (exists) {
        var content = await loadData(path, filename)
        return content[contract][chain]
    } else {
        throw new Error(`Contract not registered in ${filename}`)
    }
}

export function contractExists(content, name, chain, address) {
    try {
        return content[name] !== undefined && content[name][chain] !== undefined && content[name][chain] !== address
    } catch (e) {
        return false
    }
}

export async function confirmOverwrite(filename, name, chain, address) {
    const answers = await inquirer.prompt([
        {
            type: 'confirm',
            name: 'overwrite',
            message: `File ${filename} exists and there is same contract ${name} on ${chain} at ${address}. Overwrite it? (file will be overwritten as default)`,
            default: true,
        }
    ])
    return answers.overwrite
}

export async function recordDatum(name, chain, datum, path, filename, suppressOverwrite) {
    const exists = await fileExists(filename)
    if (exists) {
        // find out whether info is already written
        var content = await loadData(path, filename)
        if (contractExists(content, name, chain, datum) && !suppressOverwrite) {
            const overwrite = await confirmOverwrite(filename, name, chain, content[name][chain])
            if (!overwrite) {
                return false
            } else {
                content[name][chain] = datum
            }
        } else {
            if (!(name in content)) {
                content[name] = {}
            }
            content[name][chain] = datum
        }
    } else {
        console.log(`Writing deployment info to ${filename}`)
        content  = {}
        content[name] = {}
        content[name][chain] = datum
    }

    const json = JSON.stringify(content, null, 2)
    await fs.writeFile(filename, json, { encoding: 'utf-8' })
    return true
}