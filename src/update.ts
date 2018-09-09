import { throwError, ObjectLit, exception } from ".";
import { isArray } from "./checkers";

export interface UpdateQuery {
  [key: string]: any
  $addToSet?: ObjectLit
  $set?: ObjectLit
  $inc?: ObjectLit
  $min?: ObjectLit
  $max?: ObjectLit
  $mul?: ObjectLit
  $rename?: ObjectLit
  $unset?: ObjectLit 
}

const dictionary = {
	$addToSet: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {debugger
		for (const prop in obj) {
			if (!isArray(target[prop])) {
				exception(`[$addToSet]> "${prop}" is not an array`)
				continue
			}

			;(target[prop] as any[]).push(obj[prop])
		}
		return target
  },
  
  $set: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for (const prop in obj) {
      if(typeof target[prop] !== typeof obj[prop]) {
        exception(`[$set]> typeof target[${prop}] doesn't match typeof query[${prop}]`)
        continue
      }

      // Watchout for readonly props
      try {
        target[prop] = obj[prop]
      }
      catch(e) {
        exception(`[$set]> Error setting value of target[${prop}]: "${e}"`)
      }
    }

    return target
  },

  $inc: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$inc]> query[${prop}] is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$inc]> target[${prop}] is not a number`)
        continue
      }

      try {
        target[prop] = (target[prop] || 0) + (obj[prop] || 0)
      } 
      catch (e) {
        exception(`[$inc]> Error incrementing target[${prop}]`)
      }
    }
    
    return target
  },

  $min: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        target[prop] = obj[prop] < target[prop]
          ? obj[prop]
          : target[prop]
      } 
      catch (e) {
        exception(`[$min]> Error setting target[${prop}]`)
      }
    }
    
    return target
  },

  $max: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      try {
        target[prop] = obj[prop] > target[prop]
          ? obj[prop]
          : target[prop]
      } 
      catch (e) {
        exception(`[$max]> Error setting target[${prop}]`)
      }
    }
    
    return target
  },

  $mul: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
	) => {
    for(const prop in obj) {
      if(typeof obj[prop] !== "number" || obj[prop] === NaN) {
        exception(`[$mul]> query[${prop}] is not a number`)
        continue
      }
      if(typeof target[prop] !== "number" || target[prop] === NaN) {
        exception(`[$mul]> target[${prop}] is not a number`)
        continue
      }

      try {
        target[prop] = target[prop]
          ? target[prop] * (obj[prop] || 1)
          : 0
      } 
      catch (e) {
        exception(`[$mul]> Error multiplying target[${prop}]`)
      }
    }
    
    return target
  },

  $rename: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    const validsKeys = ["symbol", "string", "number"]
    for (const oldKey in obj) {
      let val
      const newKey = obj[oldKey]
      if (!validsKeys.some(x => x === typeof newKey) || !newKey) {
        exception(`[$rename]> ${obj[oldKey]} isn't a valid key`)
        continue
      }
      if (target[oldKey]) {
        val = target[oldKey]
        delete target[oldKey]
      }
      Object.assign(target, { [newKey]: val })
    }

    return target
  },

  $unset: <T extends ObjectLit>(target: T) => (
		obj: ObjectLit = throwError()
  ) => {
    for(const key in obj) (key in target)&& delete target[key]
    return target
  }
}

export const update = <T extends ObjectLit>(object: T, query: UpdateQuery): T => {
  const target = JSON.parse(JSON.stringify(object))
	for (const prop in query) {
    if (prop in dictionary) {
			const args = []
      args.push(query[prop])
      delete query[prop]
			// @ts-ignore
			dictionary[prop](target)(...args)
    } else {
      target[prop] = query[prop]
    }
  }
		

	return target
}
