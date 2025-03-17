const { where } = require("sequelize");
const { providers } = require("../models");
const bcrypt = require("bcrypt");
const NodeGeocoder = require("node-geocoder");
const { Sequelize } = require("sequelize");

const getProviderDataById = async (id) => {
  try {
    const providersData = await providers.findOne({ where: { id } });
    if (!providersData) {
      return {
        status: 404,
        message: "Provider not found",
      };
    }

    return {
      status: 200,
      data: providersData,
      message: "Provider data fetched Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const createProvider = async (body) => {
  try {
    // Initialize geocoder
    const geocoder = NodeGeocoder({
      provider: "mapbox", // You can switch to 'mapbox' with an API key for better results
      apiKey: process.env.MAPBOX_API,
    });

    // Construct full address for geocoding
    const addressComponents = [
      body.address_line,
      body.city,
      body.state,
      body.zip_code,
      body.country || "United States",
    ]
      .filter(Boolean)
      .join(", ");

    // Get coordinates from address using geocoder
    const geocodeResults = await geocoder.geocode(addressComponents);

    if (!geocodeResults || geocodeResults.length === 0) {
      return {
        status: 400,
        message: "Could not geocode the provided address",
      };
    }

    // Extract coordinates from geocoding result
    const { latitude, longitude } = geocodeResults[0];

    // Create geom point for PostGIS
    const geom = Sequelize.fn(
      "ST_SetSRID",
      Sequelize.fn("ST_MakePoint", longitude, latitude),
      4326
    );

    // Add coordinates and geom to the provider data
    const providerData = {
      ...body,
      latitude,
      longitude,
      geom,
    };

    // Create provider with complete data
    await providers.create(providerData);

    return {
      status: 200,
      message: "Provider created Successfully",
      coordinates: { latitude, longitude },
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};
const updateProvider = async (body, id) => {
  try {
    const providerData = await providers.findOne({ where: { id } });
    if (!providerData) {
      return {
        status: 404,
        message: "Provider not found",
      };
    }
    await providers.update(body, { where: { id } });
    return {
      status: 200,
      message: "Provider updated Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const deleteProvider = async (id) => {
  try {
    const providerData = await providers.findOne({ where: { id } });
    if (!providerData) {
      return {
        status: 404,
        message: "Provider not found",
      };
    }

    const childrenProviders = await providers.findAll({
      where: { parent_id: id },
    });
    for (const child of childrenProviders) {
      await providers.destroy({ where: { id: child.id } });
    }
    await providers.destroy({ where: { id } });
    return {
      status: 200,
      message: "Provider and it's subcategories deleted Successfully",
    };
  } catch (err) {
    console.log("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

const getAllProviders = async (page = 1, limit = 10) => {
  try {
    const offset = (page - 1) * limit;

    const { count, rows: providersData } = await providers.findAndCountAll({
      limit,
      offset,
    });
    console.log(providersData);
    if (count === 0) {
      return {
        status: 404,
        message: "No providers found",
      };
    }

    return {
      status: 200,
      data: providersData,
      pagination: {
        totalRecords: count,
        totalPages: Math.ceil(count / limit),
        currentPage: page,
        pageSize: limit,
      },
      message: "Providers retrieved successfully",
    };
  } catch (err) {
    console.error("___error", err.message);
    return {
      status: 500,
      message: "Something went wrong",
    };
  }
};

module.exports = {
  createProvider,
  getProviderDataById,
  getAllProviders,
  updateProvider,
  deleteProvider,
};
