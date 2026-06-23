const Applicant = require('../models/Applicant');
const IdentityDocument = require('../models/IdentityDocument');

// Crear perfil de solicitante
const crearApplicant = async (req, res) => {
  const { userId } = req;
  const {
    document_type,
    document_number,
    birth_date,
    address,
    city,
    country,
    employment_status,
    monthly_income
  } = req.body;

  try {
    const existe = await Applicant.findOne({ where: { user_id: userId } });
    if (existe) {
      return res.status(400).json({ ok: false, msg: 'Ya tienes un perfil de solicitante creado' });
    }

    const applicant = await Applicant.create({
      user_id: userId,
      document_type,
      document_number,
      birth_date,
      address,
      city,
      country,
      employment_status,
      monthly_income
    });

    res.status(201).json({
      ok: true,
      msg: 'Perfil de solicitante creado correctamente',
      applicant
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al crear el perfil de solicitante' });
  }
};

// Obtener solicitante por id
const getApplicant = async (req, res) => {
  const { id } = req.params;

  try {
    const applicant = await Applicant.findOne({
      where: { id },
      attributes: [
        'id', 'user_id', 'document_type', 'document_number',
        'birth_date', 'address', 'city', 'country',
        'employment_status', 'monthly_income', 'profile_status', 'created_at'
      ],
      include: [{
        model: IdentityDocument,
        as: 'documents',
        attributes: ['id', 'document_front_url', 'document_back_url', 'selfie_url', 'validation_status', 'uploaded_at']
      }]
    });

    if (!applicant) {
      return res.status(404).json({ ok: false, msg: 'Solicitante no encontrado' });
    }

    res.json({ ok: true, applicant });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el solicitante' });
  }
};

// Actualizar perfil de solicitante
const actualizarApplicant = async (req, res) => {
  const { id } = req.params;
  const { userId } = req;
  const {
    document_type,
    document_number,
    birth_date,
    address,
    city,
    country,
    employment_status,
    monthly_income
  } = req.body;

  try {
    const applicant = await Applicant.findOne({ where: { id } });
    if (!applicant) {
      return res.status(404).json({ ok: false, msg: 'Solicitante no encontrado' });
    }

    if (applicant.user_id !== userId) {
      return res.status(403).json({ ok: false, msg: 'No tienes permiso para editar este perfil' });
    }

    await applicant.update({
      ...(document_type && { document_type }),
      ...(document_number && { document_number }),
      ...(birth_date && { birth_date }),
      ...(address && { address }),
      ...(city && { city }),
      ...(country && { country }),
      ...(employment_status && { employment_status }),
      ...(monthly_income && { monthly_income }),
      updated_at: new Date()
    });

    res.json({ ok: true, msg: 'Perfil actualizado correctamente' });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al actualizar el perfil' });
  }
};

// Subir documento de identidad
const subirDocumento = async (req, res) => {
  const { id } = req.params;
  const { document_front_url, document_back_url, selfie_url } = req.body;

  try {
    const applicant = await Applicant.findOne({ where: { id } });
    if (!applicant) {
      return res.status(404).json({ ok: false, msg: 'Solicitante no encontrado' });
    }

    const documento = await IdentityDocument.create({
      applicant_id: id,
      document_front_url,
      document_back_url,
      selfie_url,
      validation_status: 'PENDING'
    });

    // Actualizar profile_status a PENDING_REVIEW
    await applicant.update({
      profile_status: 'PENDING_REVIEW',
      updated_at: new Date()
    });

    res.status(201).json({
      ok: true,
      msg: 'Documento subido correctamente',
      documento
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al subir el documento' });
  }
};

// Obtener estado del perfil
const getProfileStatus = async (req, res) => {
  const { id } = req.params;

  try {
    const applicant = await Applicant.findOne({
      where: { id },
      attributes: ['id', 'profile_status']
    });

    if (!applicant) {
      return res.status(404).json({ ok: false, msg: 'Solicitante no encontrado' });
    }

    const listo = applicant.profile_status === 'READY';

    res.json({
      ok: true,
      profile_status: applicant.profile_status,
      msg: listo ? 'Perfil listo para solicitar crédito' : 'Perfil incompleto'
    });

  } catch (error) {
    console.error(error);
    res.status(500).json({ ok: false, msg: 'Error al obtener el estado del perfil' });
  }
};

module.exports = {
  crearApplicant,
  getApplicant,
  actualizarApplicant,
  subirDocumento,
  getProfileStatus
};